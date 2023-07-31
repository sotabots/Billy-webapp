type TCurrency = {
  id: string, // 'EUR'
  title: string, // 'Euro'
  symbol: string, // '€'
  in: string // 'In Euros'
  decimals: number // `2` usually
}

type TUser = { // tg user
  id: number
  url?: string // avatar url (todo: rename)
  fullName: string
  username?: string // @username
  _name: string // not used, only for mock
}

type TTransactionPart = {
  spokenName?: string
  isPayed: boolean
  amount: number
  user?: TUser
}

type TTransaction = {
  // meta data
  users: TUser[] // all chat users
  currencies: TCurrency[] // all possible currencies

  // main data
  text: string // recognized text with <b>Name</b> highlighting
  parts: TTransactionPart[]
  currency: TCurrency
}

export type { TCurrency, TUser, TTransactionPart, TTransaction }
