import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TCurrencyId, TTransaction, TFilterTotal, TFilterPeriod, TNewTransaction, TFlow, TPaywallSource, TPaywallFrom } from '../types'

type TStore = {
  apiUrl: undefined | string
  setApiUrl: (_: string) => void

  isApiFallbackRequest: boolean
  setIsApiFallbackRequest: (_: boolean) => void

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
  selectedChatId: undefined | number
  setSelectedChatId: (chatId: number) => void

  pwTxId: undefined | string
  setPwTxId: (pwTxId: string) => void
  txId: undefined | string
  setTxId: (ixId: string) => void
  selectPersonId: string | null
  setSelectPersonId: (i: string | null) => void
  selectPersonIsPayer: boolean
  setSelectPersonIsPayer: (_: boolean) => void
  isSelectPayers: null | boolean
  setIsSelectPayers: (isSelectPayers: null | boolean) => void

  transaction: undefined | TTransaction | TNewTransaction,
  setTransaction: (transaction: undefined | TTransaction | TNewTransaction) => void

  isAuthorSharesInited: boolean
  setIsAuthorSharesInited: (isAuthorSharesInited: boolean) => void
  txComment: string,
  setTxComment: (txComment: string) => void
  isSuccess: boolean | null
  setSuccess: (val: boolean | null) => void
  txPatchError: null | Error
  setTxPatchError: (txPatchError: null | Error) => void

  summaryCurrencyId: null | TCurrencyId
  setSummaryCurrencyId: (summaryCurrencyId: null | TCurrencyId) => void
  summaryPrevCurrencyId: null | TCurrencyId
  setSummaryPrevCurrencyId: (summaryPrevCurrencyId: null | TCurrencyId) => void

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

  paywallSource: TPaywallSource
  setPaywallSource: (paywallSource: TPaywallSource) => void
  paywallFrom: TPaywallFrom
  setPaywallFrom: (paywallFrom: TPaywallFrom) => void

  isDebug: boolean
  setDebug: (isDebug: boolean) => void
}

export const useStore = create<TStore>((set /*, get */) => ({
  apiUrl: undefined,
  setApiUrl: (apiUrl: string) => set(({ apiUrl })),

  isApiFallbackRequest: false,
  setIsApiFallbackRequest: (isApiFallbackRequest: boolean) => set(({ isApiFallbackRequest })),

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
  selectedChatId: undefined,
  setSelectedChatId: (selectedChatId) => set(({ selectedChatId })),

  pwTxId: undefined,
  setPwTxId: (pwTxId) => set(({ pwTxId })),
  txId: undefined,
  setTxId: (txId) => set(({ txId })),
  selectPersonId: null,
  setSelectPersonId: (selectPersonId) => set({ selectPersonId }),
  selectPersonIsPayer: false,
  setSelectPersonIsPayer: (selectPersonIsPayer) => set({ selectPersonIsPayer }),
  isSelectPayers: null,
  setIsSelectPayers: (isSelectPayers) => set({ isSelectPayers }),
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

  summaryCurrencyId: null,
  setSummaryCurrencyId: (summaryCurrencyId) => set(({ summaryCurrencyId })),
  summaryPrevCurrencyId: null,
  setSummaryPrevCurrencyId: (summaryPrevCurrencyId) => set(({ summaryPrevCurrencyId })),

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

  paywallSource: undefined,
  setPaywallSource: (paywallSource) => set(( { paywallSource } )),
  paywallFrom: undefined,
  setPaywallFrom: (paywallFrom) => set(( { paywallFrom } )),

  isDebug: [143871296, 330528429, 436721347].includes(window.Telegram?.WebApp.initDataUnsafe.user?.id || 0) /*|| false*/,
  setDebug: (isDebug) => set(( { isDebug } )),
}))

export const usePersistStore = create<{
  prevChatId: number | undefined
  setPrevChatId: (prevChatId: number) => void
}>()(
  persist(
    (set) => ({
      prevChatId: undefined,
      setPrevChatId: (prevChatId) => set({ prevChatId }),

    }), {
      name: 'persist-store',
    },
  ),
)