import { create } from 'zustand'

import { TCurrency, TCurrencyId, TTransaction, TUser, TChat, TSummary } from '../types'

type TStore = {
  overlays: number[]
  setOverlays: (val: number[]) => void
  txId: undefined | string | null
  setTxId: (ixId: string | null) => void
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectPersonId: string | null
  setSelectPersonId: (i: string | null) => void
  isSelectPayers: null | boolean
  setIsSelectPayers: (isSelectPayers: null | boolean) => void
  currencies: TCurrency[]
  setCurrencies: (currencies: TCurrency[]) => void
  setCurrency: (currency: TCurrencyId) => void
  chat: undefined | TChat
  setChat: (chat: TChat) => void
  transaction: undefined | TTransaction,
  setTransaction: (transaction: TTransaction) => void
  txComment: string,
  setTxComment: (txComment: string) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
  txPatchError: null | Error
  setTxPatchError: (txPatchError: null | Error) => void

  summaryId: undefined | string | null
  setSummaryId: (summaryId: string | null) => void
  summary: undefined | TSummary | null
  setSummary: (summary: TSummary) => void
}

export const useStore = create<TStore>((set, get) => ({
  overlays: [],
  setOverlays: (overlays) => set(({ overlays })),

  txId: undefined,
  setTxId: (txId) => set(({ txId })),
  users: [],
  setUsers: (users) => set({ users }),
  selectPersonId: null,
  setSelectPersonId: (selectPersonId) => set({ selectPersonId }),
  isSelectPayers: null,
  setIsSelectPayers: (isSelectPayers) => set({ isSelectPayers }),
  currencies: [],
  setCurrencies: (currencies) => set({ currencies }),
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
  chat: undefined,
  setChat: (chat) => set(({ chat })),
  transaction: undefined,
  setTransaction: (transaction) => set(({ transaction })),
  txComment: '',
  setTxComment: (txComment) => set(({ txComment })),
  isSuccess: null,
  setSuccess: (isSuccess) => set(({ isSuccess })),
  txPatchError: null,
  setTxPatchError: (txPatchError) => set(({ txPatchError })),

  summaryId: undefined,
  setSummaryId: (summaryId) => set(({ summaryId })),
  summary: undefined,
  setSummary: (summary) => set(( { summary } )),
}))
