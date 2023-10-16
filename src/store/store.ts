import { create } from 'zustand'
import { mockCurrencies } from './mock'
import { TUser, TCurrency, TTransaction } from './../types'

import { mockUsers, mockTransaction } from './mock'

const isMock = true

type TStore = {
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectUserIndex: number | null
  setSelectUserIndex: (i: number | null) => void
  currencies: TCurrency[]
  currency: TCurrency | null
  setCurrency: (currency: TCurrency) => void
  transaction: TTransaction,
  setTransaction: (transaction: TTransaction) => void
}

const useStore = create<TStore>((set, get) => ({
  users: isMock ? mockUsers : [],
  setUsers: (users) => set({ users }),
  selectUserIndex: null,
  setSelectUserIndex: (selectUserIndex) => set({ selectUserIndex }),
  currencies: isMock ? mockCurrencies : [],
  currency: isMock ? mockCurrencies[0] : null,
  setCurrency: (currency) => {
    set({ currency })
    set({
      transaction: {
        ...get().transaction,
        currency_id: currency.id
      }
    })
  },
  transaction: mockTransaction,
  setTransaction: (transaction) => set(({ transaction })),
}))


export {
  useStore
}
