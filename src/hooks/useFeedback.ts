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
  'send_settleup' |

  // Settings
  'open_settings_web' |
  'press_currency_settings_web' |
  'set_currency_settings_web' |
  'press_language_settings_web' |
  'set_language_settings_web' |

  // Match names
  'press_add_user_expnames_web' |
  'set_users_expnames_web' | // todo: add after SelectUser refactor
  'press_change_user_expnames_web' |
  'set_user_expnames_web' |
  'delete_user_expnames_web' |

  // Checkout
  'edit_payers_expshares_web' |
  'set_payers_expshares_web' |
  'edit_debtors_expshares_web' |
  'set_debtors_expshares_web' |
  'change_currency_expshares_web' | // todo: rename?
  'set_currency_expshares_web' |
  'press_cancel_transaction_expshares_web' |
  'confirm_cancel_transaction_expshares_web' |
  'set_equal_share_expshares_web' |
  'unset_equal_share_expshares_web' |

  // Total
  'show_balances_total_web' |
  'add_expense_total_web' |
  'edit_transaction_total_web' |
  'press_filter_total_web' |
  'press_details_total_web' |

  // Balances
  'show_total_balances_web' |
  'show_single_currency_balances_web' |
  'settle_up_balances_web' |
  'press_details_balances_web' |

  // Settle Up
  'change_user_settleup_web' |
  'set_user_settleup_web' |
  'confirm_settleup_web'


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
      // @ts-expect-error // todo: fix '@vkruglikov/react-telegram-web-app'
      userIsPremium: wa?.initDataUnsafe.user?.is_premium || null,

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
