type TCurrencyId = string

type TCurrency = {
  id: TCurrencyId, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
  decimals: number // `4` usually
  visibleDecimals: number // `2` usually
}

type TUser = { // tg user
  id: number
  url?: string // avatar url (todo: rename)
  fullName: string
  username?: string // @username
  _name: string // not used, only for mock
}

type TShare = {
  spokenName?: string
  isPayed: boolean // paid or owed
  amount: number
  user?: TUser
}

type TTransaction = {
  // meta data, will be removed
  users: TUser[] // all chat users

  // main data
  text: string // recognized text with <b>Name</b> highlighting
  shares: TShare[]
  currency_id: TCurrencyId
}

export type { TCurrencyId, TCurrency, TUser, TShare, TTransaction }
