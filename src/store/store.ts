import { create } from 'zustand'
import { TCurrency, TCurrencyId, TTransaction, TUser } from './../types'

import { mockCurrencies, mockUsers, mockTransaction } from '../api/mock'

const isMock = true

type TStore = {
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectUserIndex: number | null
  setSelectUserIndex: (i: number | null) => void
  currencies: TCurrency[]
  setCurrency: (currency: TCurrencyId) => void
  transaction: TTransaction,
  setTransaction: (transaction: TTransaction) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
}

const useStore = create<TStore>((set, get) => ({
  users: isMock ? mockUsers : [],
  setUsers: (users) => set({ users }),
  selectUserIndex: null,
  setSelectUserIndex: (selectUserIndex) => set({ selectUserIndex }),
  currencies: isMock ? mockCurrencies : [],
  currency: isMock ? mockCurrencies[0] : null,
  setCurrency: (currencyId) => {
    set({
      transaction: {
        ...get().transaction,
        currency_id: currencyId
      }
    })
  },
  transaction: mockTransaction,
  setTransaction: (transaction) => set(({ transaction })),
  isSuccess: null,
  setSuccess: (isSuccess) => set(({ isSuccess }))
}))


export {
  useStore
}
