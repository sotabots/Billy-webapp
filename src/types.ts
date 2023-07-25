type TUser = {
  id: number
  url?: string
  name: string
  fullName: string
  username: string // todo ?
}

type TUserRelation = {
  title?: string // spoken name
  user?: TUser
}

type TCurrency = {
  id: string,
  title: string,
  symbol: string,
  in: string
}

type TTransaction = (TUser & {
  // todo: user field
  isPayed: boolean
  amount: number
})[]

export type { TUserRelation, TCurrency, TUser, TTransaction }
