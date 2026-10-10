import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const sources = Object.fromEntries(['hooks/useInit.ts', 'hooks/useApi.ts', 'pages/Home.tsx', 'pages/UserBalance.tsx', 'utils.ts'].map(path => [
  path,
  ts.transpileModule(readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText,
]))
const noop = () => {}
const jsx = (type, props) => ({ type, props })
const kit = Object.fromEntries(['Page', 'Header', 'CustomHeader', 'Bottom', 'Button', 'Overlay', 'Panel', 'DebtDetailed', 'Divider', 'UserButton', 'Currencies', 'CurrencyAmount', 'Debt', 'Tabs', 'Field', 'InputText'].map(name => [name, name]))

// Render the real components with isolated state/effect slots and mocked I/O.
function createApp(payload) {
  let currentFrame
  let dirty = true
  let summary
  let homeTree
  let balanceTree
  let balanceProps
  const frames = new Map()
  const effects = []
  const queries = []
  const requests = []
  const state = { flow: 'summary', isFlowFeedback: true, isOnboardingFeedback: true, summaryCurrencyId: null }
  const setters = {}
  const store = new Proxy(state, {
    get(target, key) {
      if (typeof key === 'string' && key.startsWith('set')) {
        const field = key[3].toLowerCase() + key.slice(4)
        return setters[key] ||= value => {
          if (!Object.is(target[field], value)) { target[field] = value; dirty = true }
        }
      }
      return target[key]
    },
  })
  const react = {
    useState(initial) {
      const index = currentFrame.index++
      const frame = currentFrame
      if (!(index in frame.slots)) frame.slots[index] = typeof initial === 'function' ? initial() : initial
      return [frame.slots[index], value => {
        const next = typeof value === 'function' ? value(frame.slots[index]) : value
        if (!Object.is(frame.slots[index], next)) { frame.slots[index] = next; dirty = true }
      }]
    },
    useRef(initial) { return react.useState({ current: initial })[0] },
    useMemo(factory, deps) {
      const index = currentFrame.index++
      const previous = currentFrame.slots[index]
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        currentFrame.slots[index] = { deps, value: factory() }
      }
      return currentFrame.slots[index].value
    },
    useEffect(effect, deps) {
      const index = currentFrame.index++
      const previous = currentFrame.slots[index]
      if (!previous || !deps || deps.some((value, i) => !Object.is(value, previous[i]))) effects.push(effect)
      currentFrame.slots[index] = deps
    },
  }
  const location = { pathname: '/', search: '' }
  // The updated backend preserves this payload while replacing /chat_balance with /app.
  const startParam = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  const preparedLink = `https://t.me/BillyMoney_bot/app?startapp=${startParam}`
  const context = {
    console: { log: noop, error: noop }, URLSearchParams, atob, btoa,
    window: { location: { search: '' }, Telegram: { WebApp: { initDataUnsafe: { start_param: new URL(preparedLink).searchParams.get('startapp') } } } },
  }
  const hooks = {
    useStore: () => store,
    useTgSettings: () => ({ goSettings: noop }), useApiUrlInit: noop,
    useUsers: () => ({ users: [], getUserById: noop }), useUser: () => ({}),
    useAuth: () => ({ userId: 123 }), useGetTransactionChatId: () => ({}),
    useFeedback: () => ({ feedback: noop }), usePostUserOnboarding: () => noop,
    useFilter: () => ({}), useSummary: () => ({ debtCurrencyIds: [], debts: [] }),
    useGetSummary(options) { queries.push(options); return { data: summary, refetch: noop } },
    useGetSummarySheetRebuild: () => noop, useGetChat: () => ({}),
    useCurrencies: () => ({ getCurrencyById: currencyId => ({ symbol: currencyId }) }),
    useGetUsers: () => ({}), useGetUserSettings: () => ({}),
    useGetTransactions: () => ({ refetch: noop }), useGetProfile: () => ({ refetch: noop }),
    usePostTransaction: () => noop, usePostDebtReminder: () => noop,
  }
  const imports = {
    react, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'Fragment' },
    'react-router-dom': { useLocation: () => location, useNavigate: () => path => {
      if (location.pathname !== path) { location.pathname = path; dirty = true }
    } },
    '@vkruglikov/react-telegram-web-app': { useInitData: () => [{}], useShowPopup: () => noop, useHapticFeedback: () => [noop, noop] },
    'react-i18next': { useTranslation: () => ({ t: key => key }) },
    classnames: { default: () => '' }, 'lottie-react': { default: 'Lottie' },
    '../hooks': hooks, '../kit': kit,
    '../i18n': { default: { language: 'ru', languages: ['ru'] } },
    './const': { visible_decimals: 2 },
  }
  function load(path, extra = {}) {
    const exports = {}
    vm.runInNewContext(sources[path], { ...context, exports, require(name) {
      if (name.startsWith('../assets/')) return { default: {}, ReactComponent: 'Icon' }
      const available = { ...imports, ...extra }
      assert.ok(name in available, `Unexpected import: ${name}`)
      return available[name]
    } })
    return exports
  }
  const utils = load('utils.ts')
  imports['../utils'] = utils
  hooks.useInit = load('hooks/useInit.ts').useInit
  const { UserBalance } = load('pages/UserBalance.tsx')
  const { Home } = load('pages/Home.tsx', { '../pages': { UserBalance, Summary: 'Summary', ChatSettings: 'ChatSettings' }, './ChatBalance': { ChatBalance: 'ChatBalance' } })
  const { useGetSummary } = load('hooks/useApi.ts', {
    './useApiMock': {},
    '@tanstack/react-query': { useQuery: options => options },
    '../api/backendMonitor': { backendFetch: async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => summary } } },
  })
  const render = (component, props) => {
    if (!frames.has(component)) frames.set(component, { slots: [], index: 0 })
    currentFrame = frames.get(component)
    currentFrame.index = 0
    return component(props)
  }
  return {
    state, queries, requests,
    render() {
      dirty = true
      for (let i = 0; dirty; i++) {
        assert.ok(i < 20, 'components must settle after rendering')
        dirty = false
        effects.length = 0
        homeTree = render(Home, { tab: location.pathname === '/chat-balance' ? 'chat-balance' : 'summary' })
        balanceProps = find(homeTree, UserBalance)?.props
        balanceTree = balanceProps ? render(UserBalance, balanceProps) : null
        for (const effect of effects) effect()
      }
    },
    setSummary(value) { summary = value },
    get balanceProps() { return balanceProps },
    get card() { return find(balanceTree, 'DebtDetailed')?.props },
    back() { find(homeTree, 'Header').props.onBack() },
    get userList() { return find(homeTree, 'ChatBalance') },
    async fetchFocusedSummary() {
      state.apiUrl = 'https://api.example.test'
      hooks.useChatId = () => ({ chatId: state.chatIdStart })
      const query = useGetSummary({ otherUserId: balanceProps.focusUserId })
      return query.queryFn()
    },
  }
}

function find(node, type) {
  if (!node || typeof node !== 'object') return undefined
  if (node.type === type) return node
  for (const child of [node.props?.children].flat(Infinity)) {
    const found = find(child, type)
    if (found) return found
  }
}

const selectedDebt = { from_user_id: 123, to_user_id: 456, value_primary: { currency_id: 'RUB', amount: 1500.25 }, value_secondary: { currency_id: 'USD', amount: 15 } }
const reminder = { chat_id: -1001234567890, balance_user_id: 123, balance_debt: { from_user_id: 123, to_user_id: 456, currency_id: 'RUB', amount: 1500.25 } }
const makeSummary = (block = 'debt') => ({
  chat_id: reminder.chat_id,
  balance: Object.fromEntries(['total', 'debt', 'credit'].map(name => [name, {
    value: { currency_id: 'USD', amount: 15 },
    details: name === block ? [
      { ...selectedDebt, to_user_id: 789 },
      { ...selectedDebt, value_primary: { currency_id: 'EUR', amount: 1500.25 } },
      { ...selectedDebt, value_primary: { currency_id: 'RUB', amount: 2500 } },
      selectedDebt,
    ] : [],
  }])),
})

for (const block of ['debt', 'credit']) {
  test(`shared app reminder selects its exact ${block} after the summary loads`, async () => {
    const app = createApp(reminder)
    app.render()
    assert.equal(app.balanceProps.focusUserId, reminder.balance_user_id)
    assert.equal(app.queries.at(-1).otherUserId, reminder.balance_user_id)
    assert.equal(app.card, undefined, 'wait for the API instead of selecting another debt')
    app.setSummary(makeSummary(block))
    app.render()
    assert.equal(JSON.stringify(app.card.debt), JSON.stringify(selectedDebt))
    assert.equal(app.card.amount, 1500.25)
    await app.fetchFocusedSummary()
    const request = new URL(app.requests[0].url)
    assert.equal(request.pathname, '/summary')
    assert.equal(request.searchParams.get('chat_id'), String(reminder.chat_id))
    assert.equal(request.searchParams.get('other_user_id'), String(reminder.balance_user_id))
    app.back()
    app.render()
    assert.equal(app.card, undefined, 'Back closes the selected debt')
    app.back()
    app.render()
    assert.ok(app.userList, 'Back returns to the user list without reopening the reminder')
  })
}

test('a reminder whose debt no longer exists leaves the user balance open', () => {
  const app = createApp(reminder)
  const summary = makeSummary()
  summary.balance.debt.details.pop()
  app.setSummary(summary)
  app.render()
  assert.equal(app.balanceProps.focusUserId, reminder.balance_user_id)
  assert.equal(app.card, undefined, 'do not substitute a different recipient, currency or amount')
})
