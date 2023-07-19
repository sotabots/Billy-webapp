import { create } from 'zustand'
import { mockCurrencies } from './mock'
import { TUser, TUserRelation, TCurrency, TTransaction } from './../types'

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
  transaction: TTransaction,
  setTransaction: (transaction: TTransaction) => void
}

const useStore = create<TStore>((set) => ({
  users: isMock ? mockUsers : [],
  setUsers: (users) => set(({ users })),
  userRelations: isMock ? mockUserRelations : [],
  setUserRelations: (userRelations) => set(({ userRelations })),
  currencies: isMock ? mockCurrencies : [],
  currency: isMock ? mockCurrencies[0] : null,
  setCurrency: (currency) => set(({ currency })),
  transaction: mockTransaction,
  setTransaction: (transaction) => set(({ transaction })),
}))


export {
  useStore
}
