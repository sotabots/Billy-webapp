import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(readFileSync(new URL('../src/api/backendMonitor.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const primary = 'https://api.example.test'
const fallback = 'https://fallback.example.test'
const ok = () => ({ ok: true, json: async () => ({ name: 'Billy API', api_version: 'v1.0.0' }) })
const flush = () => new Promise(resolve => setImmediate(resolve))

function createMonitor(backends, fetchImpl) {
  const requests = []
  const switches = []
  const timers = new Map()
  let timerId = 0
  const state = { apiUrl: primary, setApiUrl(value) { state.apiUrl = value; switches.push(value) } }
  const exports = {}
  vm.runInNewContext(source, {
    exports, URL, AbortController, DOMException,
    console: { log() {} },
    fetch(input, init) { requests.push({ input, init }); return fetchImpl(input, init) },
    setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId },
    clearTimeout(id) { timers.delete(id) },
    require(name) {
      if (name === './backendConfig') return {
        CONFIGURED_BACKENDS: backends, cacheBackend() {}, normalizeApiUrl: url => url.replace(/\/+$/, ''),
      }
      if (name === '../hooks/useStore') return { useStore: { getState: () => state } }
      throw new Error(`Unexpected import: ${name}`)
    },
  })
  return {
    ...exports, requests, switches,
    runTimers(delay) {
      for (const [id, timer] of [...timers]) {
        if (timer.delay === delay) { timers.delete(id); timer.callback() }
      }
    },
  }
}

test('slow data requests check /health once per backend without refetching currencies', async () => {
  let finish
  const monitor = createMonitor([primary, fallback], input => input.endsWith('/health')
    ? Promise.resolve(ok())
    : new Promise(resolve => { finish = resolve }))
  const pending = monitor.backendFetch(`${primary}/currencies/?chat_id=-123`)
  monitor.runTimers(2000)
  monitor.triggerBackendRecheck()
  await flush()
  assert.deepEqual(monitor.requests.map(request => request.input), [
    `${primary}/currencies/?chat_id=-123`, `${primary}/health`, `${fallback}/health`,
  ])
  assert.ok(monitor.requests.slice(1).every(request => request.init.cache === 'no-store'))
  finish(ok())
  assert.equal((await pending).ok, true)
})

test('one configured backend does not issue health checks for a slow request', async () => {
  let finish
  const monitor = createMonitor([primary], () => new Promise(resolve => { finish = resolve }))
  const pending = monitor.backendFetch(`${primary}/chat/transactions?chat_id=-123`)
  monitor.runTimers(2000)
  await flush()
  assert.equal(monitor.requests.length, 1)
  finish(ok())
  await pending
})

test('failed primary switches to a fallback with a valid health response', async () => {
  const monitor = createMonitor([primary, fallback], async input => input === `${primary}/health`
    ? { ok: false }
    : ok())
  monitor.triggerBackendRecheck()
  await flush()
  assert.deepEqual(monitor.switches, [fallback])
})

test('a fallback with malformed health JSON is not selected', async () => {
  const monitor = createMonitor([primary, fallback], async input => input === `${primary}/health`
    ? { ok: false }
    : { ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } })
  monitor.triggerBackendRecheck()
  await flush()
  assert.deepEqual(monitor.switches, [])
})

test('timing out while reading a health response body does not select that backend', async () => {
  const monitor = createMonitor([primary, fallback], async (input, init) => input === `${primary}/health`
    ? { ok: false }
    : { ok: true, json: () => new Promise((resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    }) })
  monitor.triggerBackendRecheck()
  await flush()
  monitor.runTimers(3000)
  await flush()
  assert.deepEqual(monitor.switches, [])
})
