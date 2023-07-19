type TCurrency = {
  id: string,
  title: string,
  symbol: string,
  in: string
}

type TUser = {
  id: number
  url?: string
  name: string
  username: string // todo: ?
}

type TData = (TUser & {
  isPayed: boolean
  amount: number
})[]

export type { TCurrency, TUser, TData }
