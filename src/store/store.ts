import { create } from 'zustand'
import { TCurrency, TCurrencyId, TTransaction, TUser } from './../types'

import { mockCurrencies, mockUsers, mockTransaction } from '../api/mock'

const isMock = true

type TStore = {
  txId: undefined | string | null
  setTxId: (ixId: string | null) => void
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectPersonId: string | null
  setSelectPersonId: (i: string | null) => void
  currencies: TCurrency[]
  setCurrency: (currency: TCurrencyId) => void
  transaction: TTransaction,
  setTransaction: (transaction: TTransaction) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
}

const useStore = create<TStore>((set, get) => ({
  txId: undefined,
  setTxId: (txId) => set(({ txId })),
  users: isMock ? mockUsers : [],
  setUsers: (users) => set({ users }),
  selectPersonId: null,
  setSelectPersonId: (selectPersonId) => set({ selectPersonId }),
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
