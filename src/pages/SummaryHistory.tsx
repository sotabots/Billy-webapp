import { useState } from 'react'
// import { useTranslation } from 'react-i18next'

import { closeApp } from '../utils'

import Screen from '../kit/Screen'
import Header from '../kit/Header'
import Tabs from '../kit/Tabs'

// import { decimals } from '../const'
import { useInit } from '../hooks'
import { useStore } from '../store'

import { ReactComponent as ChatIcon } from '../assets/chat.svg'
import { ReactComponent as ChartIcon } from '../assets/chart.svg'

import Summary from './Summary'
import History from './History'

function SummaryHistory() {
  useInit()

  const [tab, setTab] = useState<'balance' | 'history'>('balance')

  const [selectedId, setSelectedId] = useState<null | string>(null)
  const isSelected = selectedId !== null

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // const { t } = useTranslation()

  const { isDebug } = useStore()

  return (
    <Screen>
      <Header onBack={
        (tab === 'balance' && isSelected && (() => { setSelectedId(null) })) ||
        (tab === 'history' && isFilterOpen && (() => { setIsFilterOpen(false) })) ||
        closeApp
      } />

      {isDebug && !(
        tab === 'balance' && isSelected ||
        tab === 'history' && isFilterOpen
      ) && (
        <Tabs
          className="mb-2"
          tabs={[
            {
              icon: ChatIcon,
              title: 'User Balance',
              isActive: tab === 'balance',
              onClick: () => { setTab('balance') }
            },
            {
              icon: ChartIcon,
              title: 'Total & Transactions',
              isActive: tab === 'history',
              onClick: () => { setTab('history') }
            },
          ]}
        />
      )}

      {tab === 'balance' && (
        <Summary selectedId={selectedId} setSelectedId={setSelectedId} />
      )}

      {tab === 'history' && (
        <History isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
      )}
    </Screen>
  )
}

export default SummaryHistory
