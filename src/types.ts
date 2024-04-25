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
  shares: TShare[]
  time_created: string
  nutshell: string | null
  category: string | null
  // todo: improve
}

export type TNewTransaction = Omit<TTransaction, '_id' | 'time_created'>

export type TShare = {
  person_id: string | null // todo: only string
  related_user_id: TUserId | null
  raw_name: string | null
  normalized_name: string | null // may be missing if a new user is selected
  amount: number
  is_payer: boolean // paid or owed
  user_candidates: /*[] |*/ null // todo
}

export type TCurrencyId = string // 'RUB' | 'GEL' | 'TRY' | 'EUR'

export type TCurrency = {
  _id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
}

export type TRates = {
  [key: string]: number
}

export type TChat = {
  default_currency: TCurrencyId | null
  language_code: string // 'en' | 'ru' | 'uk' (or any string)
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