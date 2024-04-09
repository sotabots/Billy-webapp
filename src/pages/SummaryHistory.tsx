import { useState, useRef, UIEvent } from 'react'
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

  type TTab = 'balance' | 'history'
  const [tab, setTab] = useState<TTab>('balance')

  const [selectedId, setSelectedId] = useState<null | string>(null)
  const isSelected = selectedId !== null

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // const { t } = useTranslation()

  const { isDebug } = useStore()

  const [isCompactPie, setIsCompactPie] = useState<boolean>(false)

  const screenRef = useRef<HTMLDivElement>(null)

  const selectTab = (tab: TTab) => () => {
    setTab(tab)
    screenRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setIsCompactPie(e.currentTarget.scrollTop > 0)
  }

  return (
    <Screen
      _ref={screenRef}
      onScroll={onScroll}
    >
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
          className="sticky top-0 pt-2 pb-1 bg-bg2 z-[1]"
          tabs={[
            {
              icon: ChatIcon,
              title: 'User Balance',
              isActive: tab === 'balance',
              onClick: selectTab('balance'),
            },
            {
              icon: ChartIcon,
              title: 'Total & Transactions',
              isActive: tab === 'history',
              onClick: selectTab('history'),
            },
          ]}
        >
          <div className="absolute top-full left-0 w-full h-1 bg-gradient-to-b from-bg2" />
        </Tabs>
      )}

      {tab === 'balance' && (
        <Summary
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      )}

      {tab === 'history' && (
        <History
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          isCompactPie={isCompactPie}
        />
      )}
    </Screen>
  )
}

export default SummaryHistory
