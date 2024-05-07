import mixpanel from 'mixpanel-browser'

const envToken = import.meta.env.VITE_FEEDBACK_TOKEN
const isToken = !!envToken
const token = envToken || 'NO_TOKEN' // some string is needed

const EVENT = {
  OPEN_WEBAPP: 'open_webapp',
  OPEN_PAGE_TRANSACTION: 'open_page_transaction',
  OPEN_PAGE_SUMMARY: 'open_page_summary',
  OPEN_SETTINGS: 'open_settings',
  OPEN_SOON: 'open_soon',

  SEND_TRANSACTION: 'send_transaction',
  SEND_SETTLEUP: 'send_settleup',
}

const feedback = async (event: string) => {
  const wa = window.Telegram?.WebApp
  const meta = {
    userId: wa?.initDataUnsafe.user?.id || null,
    userFirstName: wa?.initDataUnsafe.user?.first_name || null,
    userLastName: wa?.initDataUnsafe.user?.last_name || null,
    userName: wa?.initDataUnsafe.user?.username || null,
    userLanguageCode: wa?.initDataUnsafe.user?.language_code || null,

    chatInstance: wa?.initDataUnsafe.chat_instance || null,
    chatType: wa?.initDataUnsafe.chat_type || wa?.initDataUnsafe.chat?.type || null,
    chatId: wa?.initDataUnsafe.chat?.id || null,
    chatTitle: wa?.initDataUnsafe.chat?.title || null,

    waPlatform: wa?.platform || null,
    waVersion: wa?.version || null,
    waColorScheme: wa?.colorScheme || null,
  }
  if (isToken) {
    console.info('[mixpanel]', event, meta)
    await mixpanel.track(event, meta)
  } else {
    console.warn('[mixpanel: no token!]', event, meta)
  }
}

mixpanel.init(token, {
  // debug: true,
  loaded: () => {
    feedback(EVENT.OPEN_WEBAPP)
  }
})


export { feedback, EVENT }
