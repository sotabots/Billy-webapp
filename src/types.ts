type TCurrency = {
  id: string,
  label: string,
  symbol: string,
  in: string
}

type TUser = {
  id: number
  url?: string
  name: string
  username: string
}


type TData = (TUser & {
  isPayed: boolean
  amount: number
})[]

export type { TCurrency, TUser, TData }
