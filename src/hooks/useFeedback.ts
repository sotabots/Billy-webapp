import mixpanel from 'mixpanel-browser'

import { useChatId } from '../hooks'
import { useStore } from '../store'

const envToken = import.meta.env.VITE_FEEDBACK_TOKEN
const isToken = !!envToken
const token = envToken || 'NO_TOKEN' // some string is needed
mixpanel.init(token)

const wa = window.Telegram?.WebApp

export type TEvent =
  'open_page_transaction_web' | // todo
  'open_page_summary_web' | // todo
  'open_soon_web' |

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
  'send_transaction_web' |

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
  'confirm_settleup_web' |

  // Onboarding
  'onboarding_started' |
  'onboarding_revolution_adding_next' |
  'onboarding_balance_next' |
  'onboarding_cashback_next' |
  'onboarding_edit_later_next' |
  'onboarding_features_next' |
  'onboarding_finished' |

  // Special
  'error_web'


export const useFeedback = () => {
  const { chatId } = useChatId()
  const { transaction, transactions } = useStore()

  const feedback = async (event: TEvent, data: { [index:string]: any } = {}) => {
    const txDataEvents: TEvent[] = [
      'open_page_transaction_web',
      'press_add_user_expnames_web',
      'set_users_expnames_web',
      'press_change_user_expnames_web',
      'set_user_expnames_web',
      'delete_user_expnames_web',
      'edit_payers_expshares_web',
      'set_payers_expshares_web',
      'edit_debtors_expshares_web',
      'set_debtors_expshares_web',
      'change_currency_expshares_web',
      'set_currency_expshares_web',
      'press_cancel_transaction_expshares_web',
      'confirm_cancel_transaction_expshares_web',
      'set_equal_share_expshares_web',
      'unset_equal_share_expshares_web',
      'edit_transaction_total_web',
      'send_transaction_web',
    ]
    const _transaction = (data.transaction_id && transactions)
      ? transactions.find(tx => tx._id === data.transaction_id)
      : transaction
    const txData = txDataEvents.includes(event)
      ? {
          transaction_id: _transaction?._id,
          // is_shares_determined: // todo
          is_confirmed: _transaction?.is_confirmed,
          is_canceled: _transaction?.is_canceled,
          // is_onboarding: _transaction?.is_onboarding,
          raw_text: _transaction?.raw_text,
          category: _transaction?.category,
          // microcategory: _transaction?.microcategory,
        }
      : {}

    const meta = {
      distinct_id: wa?.initDataUnsafe.user?.id || null,
      // userId: wa?.initDataUnsafe.user?.id || null,
      // userFirstName: wa?.initDataUnsafe.user?.first_name || null,
      // userLastName: wa?.initDataUnsafe.user?.last_name || null,
      // userName: wa?.initDataUnsafe.user?.username || null,
      // userLanguageCode: wa?.initDataUnsafe.user?.language_code || null,
      // //@ts-expect-error // todo: fix '@vkruglikov/react-telegram-web-app'
      // userIsPremium: wa?.initDataUnsafe.user?.is_premium || null,

      chat_instance: wa?.initDataUnsafe.chat_instance || null,
      chat_type: wa?.initDataUnsafe.chat_type || wa?.initDataUnsafe.chat?.type || null,
      chat_id: chatId,
      chat_title: chatId === 0 ? 'DEMO' : (wa?.initDataUnsafe.chat?.title || null),

      wa_platform: wa?.platform || null,
      wa_version: wa?.version || null,
      wa_color_scheme: wa?.colorScheme || null,

      ...txData,
      ...data,
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
