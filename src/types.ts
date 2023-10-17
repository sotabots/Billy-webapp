type TUserId = number

type TUser = { // tg user
  id: TUserId
  username?: string // @username
  first_name: string
  last_name?: string
  profile_photo?: string // avatar url

  _name?: string // not used, only for mock
}

type TTransaction = {
  // meta data, will be removed
  users: TUser[] // all chat users

  id: string
  is_voice: boolean
  raw_text: string
  formatted_text?: string // with <b>Name</b> highlighting
  currency_id: TCurrencyId
  shares_confirmed: boolean
  shares: TShare[]
}

type TShare = {
  normalized_name?: string // may be missing if a new user is selected
  is_payer: boolean // paid or owed
  amount: number
  related_user_id?: TUserId
}

type TCurrencyId = string

type TCurrency = {
  id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
  decimals: number // `4` usually
  visibleDecimals: number // `2` usually
}

export type { TCurrencyId, TCurrency, TUser, TShare, TTransaction }
