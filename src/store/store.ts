import { create } from 'zustand'
import { mockCurrencies } from './mock'
import { TUser, TUserRelation, TCurrency, TData } from './../types'

import { mockUsers, mockUserRelations, mockTransaction } from './mock'

const isMock = true

type TStore = {
  users: TUser[]
  setUsers: (users: TUser[]) => void
  userRelations: TUserRelation[]
  setUserRelations: (userRelations: TUserRelation[]) => void
  currencies: TCurrency[]
  currency: TCurrency | null
  setCurrency: (currency: TCurrency) => void
  data: TData,
  setData: (data: TData) => void
}

const useStore = create<TStore>((set) => ({
  users: isMock ? mockUsers : [],
  setUsers: (users) => set(({ users })),
  userRelations: isMock ? mockUserRelations : [],
  setUserRelations: (userRelations) => set(({ userRelations })),
  currencies: isMock ? mockCurrencies : [],
  currency: isMock ? mockCurrencies[0] : null,
  setCurrency: (currency) => set(({ currency })),
  data: mockTransaction,
  setData: (data) => set(({ data })),
}))


export {
  useStore
}
