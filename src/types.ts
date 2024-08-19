export type TUserId = number // tg id

export type TChatId = number

export type TUser = { // tg user
  _id: TUserId
  username?: string // @username without @
  first_name: string
  last_name?: string
  profile_photo: string | null // avatar url

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
  cashback: number | null
  is_onboarding?: boolean // todo: remove '?' later
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
}

export type TLanguageCode = 'en' | 'ru' | 'uk'

export type TRates = {
  [key: string]: number
}

export type TMode = 'family' | 'travel'

export type TChat = {
  default_currency: TCurrencyId | null
  language_code: TLanguageCode
  silent_mode: boolean
  is_admin: boolean
  mode: TMode
  cashback: number
  monthly_limit: number
  rates: TRates
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
  amount: number
  productKey: TPlanProductKey
}
