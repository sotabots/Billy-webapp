import { create } from 'zustand'

import { TCurrency, TCurrencyId, TTransaction, TUser, TChat, TCategories, TFilterTotal, TFilterPeriod, TNewTransaction, TFlow } from '../types'

type TStore = {
  overlays: number[]
  setOverlays: (val: number[]) => void

  flow: undefined | TFlow
  setFlow: (flow: TFlow) => void
  isFlowFeedback: boolean
  setIsFlowFeedback: (isFlowFeedback: boolean) => void
  isOnboardingFeedback: boolean
  setIsOnboardingFeedback: (isOnboardingFeedback: boolean) => void

  chatIdStart: undefined | number
  setChatIdStart: (chatIdStart: number) => void
  pwTxId: undefined | string
  setPwTxId: (pwTxId: string) => void
  txId: undefined | string
  setTxId: (ixId: string) => void
  users: TUser[]
  setUsers: (users: TUser[]) => void
  selectPersonId: string | null
  setSelectPersonId: (i: string | null) => void
  selectPersonIsPayer: boolean
  setSelectPersonIsPayer: (_: boolean) => void
  isSelectPayers: null | boolean
  setIsSelectPayers: (isSelectPayers: null | boolean) => void
  currencies: TCurrency[]
  setCurrencies: (currencies: TCurrency[]) => void
  setCurrency: (currency: TCurrencyId) => void
  categories: undefined | TCategories
  setCategories: (categories: TCategories) => void
  chat: undefined | TChat
  setChat: (chat: TChat) => void
  transaction: undefined | TTransaction | TNewTransaction,
  setTransaction: (transaction: TTransaction | TNewTransaction) => void
  isAuthorSharesInited: boolean
  setIsAuthorSharesInited: (isAuthorSharesInited: boolean) => void
  txComment: string,
  setTxComment: (txComment: string) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
  txPatchError: null | Error
  setTxPatchError: (txPatchError: null | Error) => void

  summaryId: undefined | string
  setSummaryId: (summaryId: string) => void
  summaryCurrencyId: null | TCurrencyId
  setSummaryCurrencyId: (summaryCurrencyId: null | TCurrencyId) => void

  transactions: undefined | TTransaction[]
  setTransactions: (transactions: TTransaction[]) => void

  isEditTx: boolean
  setIsEditTx: (isEditTx: boolean) => void

  isFilterOpen: boolean
  setIsFilterOpen: (isFilterOpen: boolean) => void

  filterTotal: TFilterTotal
  setFilterTotal: (filterTotal: TFilterTotal) => void
  filterTotalPre: TFilterTotal
  setFilterTotalPre: (filterTotalPre: TFilterTotal) => void

  filterPeriod: TFilterPeriod
  setFilterPeriod: (filterPeriod: TFilterPeriod) => void
  filterPeriodPre: TFilterPeriod
  setFilterPeriodPre: (filterPeriodPre: TFilterPeriod) => void

  isDebug: boolean
  setDebug: (isDebug: boolean) => void
}

export const useStore = create<TStore>((set, get) => ({
  overlays: [],
  setOverlays: (overlays) => set(({ overlays })),

  flow: undefined,
  setFlow: (flow) => set(({ flow })),
  isFlowFeedback: false,
  setIsFlowFeedback: (isFlowFeedback) => set(({ isFlowFeedback })),
  isOnboardingFeedback: false,
  setIsOnboardingFeedback: (isOnboardingFeedback) => set(({ isOnboardingFeedback })),

  chatIdStart: undefined,
  setChatIdStart: (chatIdStart) => set(({ chatIdStart })),
  pwTxId: undefined,
  setPwTxId: (pwTxId) => set(({ pwTxId })),
  txId: undefined,
  setTxId: (txId) => set(({ txId })),
  users: [],
  setUsers: (users) => set({ users }),
  selectPersonId: null,
  setSelectPersonId: (selectPersonId) => set({ selectPersonId }),
  selectPersonIsPayer: false,
  setSelectPersonIsPayer: (selectPersonIsPayer) => set({ selectPersonIsPayer }),
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
  categories: undefined,
  setCategories: (categories) => set({ categories }),
  chat: undefined,
  setChat: (chat) => set(({ chat })),
  transaction: undefined,
  setTransaction: (transaction) => set(({ transaction })),
  isAuthorSharesInited: false,
  setIsAuthorSharesInited: (isAuthorSharesInited) => set(({ isAuthorSharesInited })),
  txComment: '',
  setTxComment: (txComment) => set(({ txComment })),
  isSuccess: null,
  setSuccess: (isSuccess) => set(({ isSuccess })),
  txPatchError: null,
  setTxPatchError: (txPatchError) => set(({ txPatchError })),

  summaryId: undefined,
  setSummaryId: (summaryId) => set(({ summaryId })),
  summaryCurrencyId: null,
  setSummaryCurrencyId: (summaryCurrencyId) => set(({ summaryCurrencyId })),

  transactions: undefined,
  setTransactions: (transactions) => set(( { transactions } )),

  isEditTx: false,
  setIsEditTx: (isEditTx) => set(( { isEditTx } )),

  isFilterOpen: false,
  setIsFilterOpen: (isFilterOpen) => set(( { isFilterOpen } )),

  filterTotal: 'ALL_CHAT',
  setFilterTotal: (filterTotal) => set(( { filterTotal } )),
  filterTotalPre: 'ALL_CHAT',
  setFilterTotalPre: (filterTotalPre) => set(( { filterTotalPre } )),

  filterPeriod: 'ALL_TIME',
  setFilterPeriod: (filterPeriod) => set(( { filterPeriod } )),
  filterPeriodPre: 'ALL_TIME',
  setFilterPeriodPre: (filterPeriodPre) => set(( { filterPeriodPre } )),

  isDebug: [143871296, 330528429, 436721347].includes(window.Telegram?.WebApp.initDataUnsafe.user?.id || 0) /*|| false*/,
  setDebug: (isDebug) => set(( { isDebug } )),
}))
