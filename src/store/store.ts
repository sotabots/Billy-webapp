import { create } from 'zustand'
import { TCurrency, TCurrencyId, TTransaction, TUser } from './../types'

import { mockCurrencies } from '../api/mock'

type TStore = {
  txId: undefined | string | null
  setTxId: (ixId: string | null) => void
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectPersonId: string | null
  setSelectPersonId: (i: string | null) => void
  currencies: TCurrency[]
  setCurrency: (currency: TCurrencyId) => void
  transaction: undefined | TTransaction,
  setTransaction: (transaction: TTransaction) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
}

const useStore = create<TStore>((set, get) => ({
  txId: undefined,
  setTxId: (txId) => set(({ txId })),
  users: [],
  setUsers: (users) => set({ users }),
  selectPersonId: null,
  setSelectPersonId: (selectPersonId) => set({ selectPersonId }),
  currencies: /*isMock ?*/ mockCurrencies/* : []*/, // todo
  currency: /*isMock ?*/ mockCurrencies[0]/* : null*/, // todo: get from tx
  setCurrency: (currencyId) => {
    if (get().transaction === undefined) {
      return
    }
    set({
      transaction: {
        ...get().transaction as TTransaction,
        currency_id: currencyId
      }
    })
  },
  transaction: undefined,
  setTransaction: (transaction) => set(({ transaction })),
  isSuccess: null,
  setSuccess: (isSuccess) => set(({ isSuccess }))
}))


export {
  useStore
}
