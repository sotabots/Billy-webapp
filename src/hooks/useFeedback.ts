import mixpanel from 'mixpanel-browser'

import { useStore, useChatId, useGetTransactions, useAuth } from '../hooks'

const isDev = import.meta.env.MODE === 'development'

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
  'press_cashback' |
  'press_limit' |

  // Match names
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

  // Settle Up
  'change_user_settleup_web' |
  'set_user_settleup_web' |
  'confirm_settleup_web' |

  // Onboarding
  'onb_started' |

  'onb_shared_user_launch' |
  'share_link_invitee_open' |

  'onb_tool_started' |
  'onb_tool_slide_1_next' |
  'onb_tool_slide_2_next' |
  'onb_tool_slide_3_add_chat' |
  'onb_tool_slide_3_open_app' |
  'onb_tool_finished' |

  'paywall_open' |
  'paywall_select_plan' |
  'paywall_pay' |
  'paywall_pay_finish' |

  // Special
  'error_web'


export const useFeedback = () => {
  const { userId } = useAuth()
  const { chatId } = useChatId()
  const { transaction, paywallSource } = useStore()
  const { data: transactions } = useGetTransactions()

  const feedback = async (event: TEvent, data: { [index:string]: any } = {}) => {
    const txDataEvents: TEvent[] = [
      'open_page_transaction_web',
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
          is_confirmed: _transaction?.is_confirmed,
          is_canceled: _transaction?.is_canceled,
          raw_text: _transaction?.raw_text,
          category: _transaction?.category,

          is_onboarding: _transaction?.is_onboarding,
          amount: _transaction?.shares.filter(share => share.is_payer).reduce((acc, share) => acc + share.amount, 0),
          chat_id: _transaction?.chat_id,
          currency_id: _transaction?.currency_id,
          is_shares_determined: _transaction?.shares.every(share => share.related_user_id),
          nutshell: _transaction?.nutshell,
        }
      : {}

    const paywallDataEvents: TEvent[] = [
      'paywall_open',
      'paywall_select_plan',
      'paywall_pay',
      'paywall_pay_finish',
    ]
    const paywallData = paywallDataEvents.includes(event)
      ? {
        paywall_source: paywallSource
      }
      : {}

    const meta = {
      distinct_id: userId || null,

      userId: userId || null,
      userFirstName: wa?.initDataUnsafe.user?.first_name || null,
      userLastName: wa?.initDataUnsafe.user?.last_name || null,
      userName: wa?.initDataUnsafe.user?.username || null,
      userLanguageCode: wa?.initDataUnsafe.user?.language_code || null,
      //@ts-expect-error // todo: fix '@vkruglikov/react-telegram-web-app'
      userIsPremium: wa?.initDataUnsafe.user?.is_premium || null,

      chat_instance: wa?.initDataUnsafe.chat_instance || null,
      chat_type: wa?.initDataUnsafe.chat_type || wa?.initDataUnsafe.chat?.type || null,
      chat_id: chatId,
      chat_title: chatId === 0 ? 'DEMO' : (wa?.initDataUnsafe.chat?.title || null),

      wa_platform: wa?.platform || null,
      wa_version: wa?.version || null,
      wa_color_scheme: wa?.colorScheme || null,

      ...txData,
      ...paywallData,
      ...data,
    }
    if (isToken) {
      console.info(`[feedback${isDev ? ': DEV-MUTED' : ''}]`, event, meta)
      if (!isDev) {
        await mixpanel.track(event, meta)
      }
    } else {
      console.warn('[feedback: no token!]', event, meta)
    }
  }

  return { feedback }
}
