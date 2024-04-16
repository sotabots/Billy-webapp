import { useState, useRef, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { closeApp } from '../utils'

import Screen from '../kit/Screen'
import Header from '../kit/Header'
import Tabs from '../kit/Tabs'

import { useInit } from '../hooks'
import { useStore } from '../store'

import { ReactComponent as ChatIcon } from '../assets/chat.svg'
import { ReactComponent as ChartIcon } from '../assets/chart.svg'

import Summary from './Summary'
import History from './History'

type TTab = 'summary' | 'history'

function SummaryHistory({ tab }: { tab: TTab }) {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { summary } = useStore()

  const [selectedId, setSelectedId] = useState<null | string>(null)
  const isSelected = selectedId !== null

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [isCompactPie, setIsCompactPie] = useState<boolean>(false)

  const screenRef = useRef<HTMLDivElement>(null)

  const selectTab = (tab: TTab) => () => {
    navigate('/' + tab)
    screenRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    setIsCompactPie(e.currentTarget.scrollTop > 0)
  }

  const goDetailedSummary = () => {
    if (summary) {
      window.open(summary.url, '_blank')
    }
  }

  return (
    <Screen
      _ref={screenRef}
      onScroll={onScroll}
    >
      <Header onBack={
        (tab === 'summary' && isSelected && (() => { setSelectedId(null) })) ||
        (tab === 'history' && isFilterOpen && (() => { setIsFilterOpen(false) })) ||
        closeApp
      } />

      {!(
        tab === 'summary' && isSelected ||
        tab === 'history' && isFilterOpen
      ) && (
        <Tabs
          className="sticky top-0 mb-[6px] pb-[2px] pt-2 bg-bg2 z-[1]"
          tabs={[
            {
              icon: ChatIcon,
              title: t('balance'),
              isActive: tab === 'summary',
              onClick: selectTab('summary'),
            },
            {
              icon: ChartIcon,
              title: t('totalTransactions'),
              isActive: tab === 'history',
              onClick: selectTab('history'),
            },
          ]}
        >
          <div className="absolute top-full left-0 w-full h-1 bg-gradient-to-b from-bg2" />
        </Tabs>
      )}

      {tab === 'summary' && (
        <Summary
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          goDetailedSummary={goDetailedSummary}
        />
      )}

      {tab === 'history' && (
        <History
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          isCompactPie={isCompactPie}
          goDetailedSummary={goDetailedSummary}
        />
      )}
    </Screen>
  )
}

export default SummaryHistory
