import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TTransaction } from '../types'

import { useStore } from '../store'

export const useFilter = () => {
  const { t } = useTranslation()

  const { transactions } = useStore()

  const totalSettings = [
    {
      title: 'All chat',
      value: 'ALL_CHAT',
    },
    {
      title: 'Only mine',
      value: 'ONLY_MINE'
    },
  ]
  const totalSettingDefault = totalSettings[0]

  const periodSettings = [
    {
      title: t('periodAllTime'),
      value: 'ALL_TIME',
    },
    {
      title: 'Month',
      value: 'MONTH'
    },
    {
      title: 'Week',
      value: 'WEEK'
    },
    {
      title: 'Custom',
      value: 'CUSTOM'
    },
  ]
  const periodSettingDefault = periodSettings[0]

  const [totalSetting, setTotalSetting] = useState(totalSettingDefault)
  const [periodSetting, setPeriodSetting] = useState(periodSettingDefault)

  const [fromTime, setFromTime] = useState<null | number>(null)
  const [toTime, setToTime] = useState<null | number>(null)

  const isFilterActive =
    totalSetting.value !== totalSettingDefault.value ||
    periodSetting.value !== periodSettingDefault.value

  const isArrows = periodSetting.value === 'MONTH' || periodSetting.value === 'WEEK'

  type TGroups = {
    [key: string]: TTransaction[]
  }

  type TTxGroups = {
    time: number
    txs: TTransaction[]
  }[]

  const txGroups = useMemo(() => {
    const sortedTransactions = [...transactions || []].sort((tx1, tx2) => tx1.time_created > tx2.time_created ? -1 : 1)
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
    return txGroups
  }, [transactions])

  
  return {
    periodSettings,
    periodSetting, setPeriodSetting,
    totalSettings,
    totalSetting, setTotalSetting,
    fromTime, setFromTime,
    toTime, setToTime,
    isFilterActive,
    isArrows,
    txGroups,
  }
}