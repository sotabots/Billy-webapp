import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useState } from 'react'

import { TTransaction } from '../types'

import { useStore } from './'

export const useFilter = () => {
  const [initDataUnsafe] = useInitData()

  const {
    transactions,
    isFilterOpen, setIsFilterOpen,
    filterTotal, setFilterTotal,
    filterTotalPre, setFilterPeriodPre,
    filterPeriod, setFilterPeriod,
    filterPeriodPre, setFilterTotalPre
  } = useStore()

  const openFilter = () => {
    setIsFilterOpen(true)
  }
  const closeFilter = () => {
    setIsFilterOpen(false)
    setFilterTotalPre(filterTotal)
    setFilterPeriodPre(filterPeriod)
  }
  const applyFilter = () => {
    setIsFilterOpen(false)
    setFilterTotal(filterTotalPre)
    setFilterPeriod(filterPeriodPre)
  }

  const [fromTime, setFromTime] = useState<null | number>(null)
  const [toTime, setToTime] = useState<null | number>(null)

  const isFilterActive = filterTotal !== 'ALL_CHAT' || filterPeriod !== 'ALL_TIME'
  const isArrows = filterPeriod === 'MONTH' || filterPeriod === 'WEEK'

  const filteredTransactions = (transactions || [])
    .filter(tx => filterTotal === 'ONLY_MINE'
      ? tx.shares.some(share => share.related_user_id === initDataUnsafe.user?.id)
      : true
    )

  type TGroups = {
    [key: string]: TTransaction[]
  }

  type TTxGroups = {
    time: number
    txs: TTransaction[]
  }[]

  const sortedTransactions = [...filteredTransactions].sort((tx1, tx2) => tx1.time_created > tx2.time_created ? -1 : 1)
  const groups: TGroups = sortedTransactions.reduce((groups: TGroups, tx: TTransaction) => {
    const dateKey = tx.time_created.split('T')[0]
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(tx)
    return groups
  }, {})

  const txGroups: TTxGroups  = Object.keys(groups).map((date) => {
    return {
      time: +(new Date(date)),
      txs: groups[date]
    }
  })

  return {
    isFilterOpen,
    openFilter,
    closeFilter,
    applyFilter,
    filterTotal, filterTotalPre, setFilterTotalPre,
    filterPeriod, filterPeriodPre, setFilterPeriodPre,
    fromTime, setFromTime,
    toTime, setToTime,
    isFilterActive,
    isArrows,
    txGroups,
    filteredTransactions,
  }
}