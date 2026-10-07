import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const head = html.replace(/<!--[\s\S]*?-->/g, '').match(/<head>([\s\S]*?)<\/head>/)[1]
const scripts = [...head.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
const sdkIndex = scripts.findIndex((script) => script[1].includes('/vendor/telegram-web-app.js'))
const sdk = readFileSync(new URL('../public/vendor/telegram-web-app.js', import.meta.url), 'utf8')

function createWebView() {
  const properties = new Map()
  const storage = new Map()
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} },
    location: { hash: '#tgWebAppVersion=9.6&tgWebAppPlatform=ios' },
    innerHeight: 800,
    addEventListener() {},
    removeEventListener() {},
    sessionStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    document: {
      documentElement: { style: { setProperty: (key, value) => properties.set(key, value) } },
    },
  })
  context.window = context
  context.parent = context
  const run = (source) => vm.runInContext(source, context)
  const bootstrap = () => scripts.slice(0, sdkIndex).forEach((script) => run(script[2]))
  const initialize = () => {
    run(sdk)
    scripts.slice(sdkIndex + 1).forEach((script) => run(script[2]))
  }
  return { context, properties, run, bootstrap, initialize }
}

test('the bridge is installed before a blocking SDK in the head', () => {
  assert.equal(sdkIndex, 1)
  assert.doesNotMatch(scripts[sdkIndex][1], /\b(?:async|defer|type)\s*(?:=|$)/)
  assert.equal(html.match(/src="\/vendor\/telegram-web-app.js"/g).length, 1)
})

test('early native events survive a delayed SDK and update actual WebApp state in order', () => {
  const { context, properties, run, bootstrap, initialize } = createWebView()
  bootstrap()
  run(`
    window.TelegramGameProxy.receiveEvent('theme_changed', {theme_params: {bg_color: '#ffffff'}});
    window.TelegramGameProxy_receiveEvent('theme_changed', {theme_params: {bg_color: '#000000'}});
    window.TelegramGameProxy.receiveEvent('viewport_changed', {
      height: 640, is_expanded: true, is_state_stable: true
    });
  `)
  assert.equal(context.__billyTelegramEvents.length, 3)
  initialize()
  assert.equal(context.Telegram.WebApp.themeParams.bg_color, '#000000')
  assert.equal(context.Telegram.WebApp.colorScheme, 'dark')
  assert.equal(context.Telegram.WebApp.viewportStableHeight, 640)
  assert.equal(properties.get('--tg-viewport-height'), '640px')
  assert.equal('__billyTelegramEvents' in context, false)

  let clicks = 0
  context.Telegram.WebApp.onEvent('backButtonClicked', () => clicks++)
  run("window.TelegramGameProxy.receiveEvent('back_button_pressed');")
  run("window.TelegramGameProxy_receiveEvent('back_button_pressed');")
  assert.equal(clicks, 2)
})

test('initialization works in an ordinary browser with no early events', () => {
  const { context, bootstrap, initialize } = createWebView()
  context.location.hash = ''
  bootstrap()
  initialize()
  assert.equal(context.Telegram.WebApp.platform, 'unknown')
  assert.equal(typeof context.TelegramGameProxy.receiveEvent, 'function')
  assert.equal('__billyTelegramEvents' in context, false)
})
