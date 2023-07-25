type TCurrency = {
  id: string,
  title: string,
  symbol: string,
  in: string
}

type TUser = { // tg user
  id: number
  url?: string
  fullName: string
  username?: string
  _name: string // not used, only for mock
}

type TTransactionPart = {
  spokenName?: string
  isPayed: boolean
  amount: number
  user?: TUser
}

type TTransaction = TTransactionPart[]

export type { TCurrency, TUser, TTransactionPart, TTransaction }
