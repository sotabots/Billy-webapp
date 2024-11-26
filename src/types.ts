export type TUserId = number // tg id

export type TChatId = number

export type TUser = { // tg user
  _id: TUserId
  username?: string // @username without @
  first_name: string
  last_name?: string
  profile_photo: string | null // avatar url
  language_code?: TLanguageCode
  has_active_subscription?: boolean
  shortened_name?: string
  is_admin_in_this_chat?: boolean // is user admin

  _name?: string // not used, only for mock, will be removed
}

export type TTransaction = {
  _id: string
  chat_id: TChatId | null
  creator_user_id: TUserId | null
  editor_user_id: TUserId | null
  is_voice: boolean
  raw_text: string // shown if `formatted_text` does not exist
  formatted_text?: string // with <b>Name</b> highlighting
  currency_id: TCurrencyId | null
  is_confirmed: boolean // set true before patch
  is_canceled: boolean
  is_equally: boolean
  shares: TShare[]
  time_created: string
  nutshell: string | null
  category: string | null
  // todo: improve
  is_settleup: boolean
  is_personal: boolean
  cashback: number | null
  is_onboarding?: boolean // todo: remove '?' later
  is_allowed_to_confirm?: boolean
}

export type TNewTransaction = Omit<TTransaction, '_id' | 'time_created'> & {
  _id: 'NEW'
}

export type TShare = {
  person_id: string | null // todo: only string
  related_user_id: TUserId | null
  raw_name: string | null
  normalized_name: string | null // may be missing if a new user is selected
  amount: number
  is_payer: boolean // paid or owed
  is_fixed_amount: boolean
}

export type TCurrencyId = string // 'RUB' | 'GEL' | 'TRY' | 'EUR'

export type TCurrency = {
  _id: TCurrencyId, // 'EUR'
  title: {
    en: string // 'Euro'
    ru: string
    uk: string
  },
  symbol: string // '€'
  flag: string // 🇪🇺
  is_crypto: boolean
  is_fiat: boolean
  is_used_in_chat?: boolean
}

export type TLanguageCode = 'en' | 'ru'

export type TRates = {
  [key: string]: number
}

export type TMode = 'family' | 'travel'

export type TChat = {
  default_currency: TCurrencyId | null
  language_code: TLanguageCode
  silent_mode: boolean
  is_admin: boolean // is Billy admin in this chat
  mode: TMode
  cashback: number
  monthly_limit: number
  rates: TRates
  name: string
}

export type TSummary = {
  debts: TDebt[]
  url: string
  chat_id: TChatId
}

export type TDebt = {
  from_user: TUser
  to_user: TUser
  amount: number
  currency_id: TCurrencyId
}

export type TCategories = {
  [key: string]: {
    hue: number
    emoji: string
    name: string | {
      en: string
      ru: string
    }
  }
}

export type TFilterTotal = 'ALL_CHAT' | 'ONLY_MINE'
export type TFilterPeriod = 'ALL_TIME' | 'MONTH' | 'WEEK' | 'CUSTOM'

export type TFlow = 'transaction' | 'summary'

export type TPlanProductKey =
'debug_subscription' |
'1_year_subscription' |
'1_month_subscription' |
'1_week_subscription' |
'3_days_subscription'

export type TPlan = {
  amount: 1 | 15 | 50 | 125 | 1250
  productKey: TPlanProductKey
}

export type TPaywallSource = undefined | 'onboarding' | 'summary_donut' | 'cashback' | 'monthly_limit' | 'voice_limit' | 'voice_limit_edit' | 'subscription_menu'

export type TPaywallFrom = undefined | 'edit' | 'onboarding' | 'settings' | 'summary'

export type TUserChat = {
  id: number
  name: string
  photo: string | null
  voice_limit: number
  is_settled_up: boolean
  user_balance: {
    in_user_currency: {
      amount: number
      currency_id: TCurrencyId
    },
    in_chat_currency: {
      amount: number
      currency_id: TCurrencyId
    }
  }
}

export type TProfile = {
  chats: TUserChat[]
  balance: {
    currency_id: TCurrencyId
    total: number
    debts: number
    credits: number
  }
}

export type TUserSettings = {
  payoff_links: {
    additionalProp1: string
    additionalProp2: string
    additionalProp3: string
  },
  currency: TCurrencyId
  language: string
  notify_in_private_messages: boolean
}
