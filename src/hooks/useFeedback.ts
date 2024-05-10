import mixpanel from 'mixpanel-browser'

import { useChatId } from '../hooks'

const envToken = import.meta.env.VITE_FEEDBACK_TOKEN
const isToken = !!envToken
const token = envToken || 'NO_TOKEN' // some string is needed
mixpanel.init(token)

const wa = window.Telegram?.WebApp
if (wa?.initDataUnsafe.user?.id) {
  mixpanel.identify(String(wa?.initDataUnsafe.user?.id))
}

type TEvent =
  'open_webapp' |
  'open_page_transaction' |
  'open_page_summary' |
  'open_settings' |
  'open_soon' |
  'send_transaction' |
  'send_settleup'

export const useFeedback = () => {
  const { chatId } = useChatId()

  const feedback = async (event: TEvent) => {
    const meta = {
      userId: wa?.initDataUnsafe.user?.id || null,
      distinct_id: wa?.initDataUnsafe.user?.id || null,
      userFirstName: wa?.initDataUnsafe.user?.first_name || null,
      userLastName: wa?.initDataUnsafe.user?.last_name || null,
      userName: wa?.initDataUnsafe.user?.username || null,
      userLanguageCode: wa?.initDataUnsafe.user?.language_code || null,

      chatInstance: wa?.initDataUnsafe.chat_instance || null,
      chatType: wa?.initDataUnsafe.chat_type || wa?.initDataUnsafe.chat?.type || null,
      chatId: chatId,
      chatTitle: chatId === 0 ? 'DEMO' : (wa?.initDataUnsafe.chat?.title || null),

      waPlatform: wa?.platform || null,
      waVersion: wa?.version || null,
      waColorScheme: wa?.colorScheme || null,
    }
    if (isToken) {
      console.info('[feedback]', event, meta)
      await mixpanel.track(event, meta)
    } else {
      console.warn('[feedback: no token!]', event, meta)
    }
  }

  return { feedback }
}
