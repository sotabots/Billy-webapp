import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const initSource = compile('../src/hooks/useInit.ts')
const utilsSource = compile('../src/utils.ts')

function loadModule(source, context, imports) {
  const exports = {}
  vm.runInNewContext(source, {
    ...context, exports,
    require(name) {
      assert.ok(name in imports, `Unexpected import: ${name}`)
      return imports[name]
    },
  })
  return exports
}

function createApp(payload, { pathname = '/', source = 'telegram' } = {}) {
  const effects = []
  const navigations = []
  const state = { flow: 'summary', isFlowFeedback: true, isOnboardingFeedback: true }
  const startParam = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  const location = { pathname, search: source === 'query' ? `?start=${startParam}` : '' }
  const context = {
    console: { log() {}, error() {} }, URLSearchParams, atob, btoa,
    window: {
      location: { search: '' },
      Telegram: { WebApp: { initDataUnsafe: source === 'telegram' ? { start_param: startParam } : {} } },
    },
  }
  const utils = loadModule(utilsSource, context, { './const': { visible_decimals: 2 } })
  const store = new Proxy(state, {
    get(target, key) {
      if (typeof key === 'string' && key.startsWith('set')) {
        const field = key[3].toLowerCase() + key.slice(4)
        return (value) => { target[field] = value }
      }
      return target[key]
    },
  })
  const noop = () => {}
  const hooks = {
    useTgSettings: noop, useApiUrlInit: noop,
    useStore: () => store,
    useUsers: () => ({ users: [], getUserById: noop }),
    useUser: () => ({}), useAuth: () => ({ userId: 123 }),
    useGetTransactionChatId: () => ({}),
    useFeedback: () => ({ feedback: noop }), usePostUserOnboarding: () => noop,
  }
  const { useInit } = loadModule(initSource, context, {
    react: { useEffect: (effect) => effects.push(effect) },
    'react-router-dom': {
      useLocation: () => location,
      useNavigate: () => (path) => { navigations.push(path); location.pathname = path },
    },
    '@vkruglikov/react-telegram-web-app': { useInitData: () => [{}] },
    '../hooks': hooks,
    '../i18n': { default: { language: 'ru', languages: ['ru'] } },
    '../utils': utils,
  })
  return {
    state, navigations, location,
    render() {
      effects.length = 0
      useInit()
      // Execute effects in declaration order, as React does after a render.
      for (const effect of effects) effect()
    },
  }
}

const reminder = {
  chat_id: -1001234567890,
  balance_user_id: 123,
  balance_debt: { from_user_id: 123, to_user_id: 456, currency_id: 'RUB', amount: 1500 },
}

for (const source of ['telegram', 'query']) {
  for (const pathname of ['/', '/chat-balance']) {
    test(`reminder opens its debt from ${source} on ${pathname}`, () => {
      const app = createApp(reminder, { source, pathname })
      app.render()
      assert.equal(app.location.pathname, '/chat-balance')
      assert.deepEqual(app.navigations, pathname === '/chat-balance' ? [] : ['/chat-balance'])
      assert.equal(app.state.chatIdStart, reminder.chat_id)
      assert.equal(app.state.startBalanceUserId, reminder.balance_user_id)
      assert.equal(JSON.stringify(app.state.startBalanceDebt), JSON.stringify(reminder.balance_debt))
      app.location.pathname = '/settings'
      app.navigations.length = 0
      app.render()
      assert.deepEqual(app.navigations, [], 'handled link must not override later navigation')
    })
  }
}

test('debt-only payload focuses the debtor and takes priority over the chat summary', () => {
  const { balance_user_id, ...payload } = reminder
  const app = createApp(payload)
  app.render()
  assert.deepEqual(app.navigations, ['/chat-balance'])
  assert.equal(app.state.startBalanceUserId, balance_user_id)
})

for (const [payload, destination] of [
  [{ c: -1001234567890 }, '/'],
  [{ s: 'profile' }, '/profile'],
  [{ p: 'subscription_menu', c: -1001234567890 }, '/paywall'],
  [{ t: '507f1f77bcf86cd799439011' }, '/edit?txid=507f1f77bcf86cd799439011'],
]) {
  test(`existing deep link still opens ${destination}`, () => {
    const app = createApp(payload, { pathname: '/user-balance' })
    app.render()
    assert.deepEqual(app.navigations, [destination])
  })
}
