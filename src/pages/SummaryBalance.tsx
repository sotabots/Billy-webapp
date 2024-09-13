import cx from 'classnames'
import { useState, useRef, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { closeApp } from '../utils'

import Page from '../kit/Page'
import Header from '../kit/Header'
import Tabs from '../kit/Tabs'

import { useGetSummarySheetRebuild } from '../api'
import { useStore, useInit, useFilter, useFeedback, useSummary } from '../hooks'
import { TUserId } from '../types'

import { ReactComponent as ChatIcon } from '../assets/chat.svg'
import { ReactComponent as ChartIcon } from '../assets/chart.svg'

import Summary from './Summary'
import Balance from './Balance'

type TTab = 'summary' | 'balance'

function SummaryBalance({ tab }: { tab: TTab }) {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const { isFilterOpen, closeFilter } = useFilter()

  const { summary } = useStore()
  const getSummarySheetRebuild = useGetSummarySheetRebuild()
  const { debtCurrencyIds, debts } = useSummary()

  const [selectedDebtId, setSelectedDebtId] = useState<null | string>(null)
  const isSelectedDebt = selectedDebtId !== null
  const [isRecipientsOpen, setIsRecipientsOpen] = useState<boolean>(false)
  const [customRecipientId, setCustomRecipientId] = useState<null | TUserId>(null)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)

  const [isCompactPie, setIsCompactPie] = useState<boolean>(false)

  const screenRef = useRef<HTMLDivElement>(null)

  const selectTab = (newTab: TTab) => () => {
    if (newTab === tab) {
      return
    }
    navigate('/' + newTab)
    screenRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    if (newTab === 'summary') {
      feedback('show_total_balances_web', {
        num_debts: debts.length
      })
    }
    if (newTab === 'balance') {
      feedback('show_balances_total_web', {
        currencies: debtCurrencyIds
      })
    }
  }

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    // temp disabled
    // todo: fix/enable
    if (Math.random() > 1) {
      setIsCompactPie(e.currentTarget.scrollTop > 0)
    }
  }

  const goDetailed = () => {
    if (summary) {
      window.open(summary.url, '_blank')
      getSummarySheetRebuild()
    }
  }

  return (
    <Page
      _ref={screenRef}
      className={cx(tab === 'balance' && isCurrencyOpen && '!bg-bg')}
      onScroll={onScroll}
    >
      <Header onBack={
        (tab === 'summary' && isFilterOpen && (() => {
          closeFilter()
        }))
        || (tab === 'balance' && isCurrencyOpen) && (() => {
          setIsCurrencyOpen(false)
        })
        || (tab === 'balance' && isRecipientsOpen && (() => {
          setIsRecipientsOpen(false)
        }))
        || (tab === 'balance' && isSelectedDebt && (() => {
          setSelectedDebtId(null)
          setCustomRecipientId(null)
        }))
        || closeApp
      } />

      {!(
        tab === 'summary' && isFilterOpen ||
        tab === 'balance' && isSelectedDebt ||
        tab === 'balance' && isCurrencyOpen
      ) && (
        <Tabs
          className="sticky top-0 mb-[6px] pb-[2px] pt-2 bg-bg2 z-[1]"
          tabs={[
            {
              icon: ChartIcon,
              title: t('totalTransactions'),
              isActive: tab === 'summary',
              onClick: selectTab('summary'),
            },
            {
              icon: ChatIcon,
              title: t('balance'),
              isActive: tab === 'balance',
              onClick: selectTab('balance'),
            },
          ]}
        >
          <div className="absolute top-full left-0 w-full h-1 bg-gradient-to-b from-bg2" />
        </Tabs>
      )}

      {tab === 'summary' && (
        <Summary
          isCompactPie={isCompactPie}
          goDetailed={goDetailed}
        />
      )}

      {tab === 'balance' && (
        <Balance
          isCurrencyOpen={isCurrencyOpen}
          setIsCurrencyOpen={setIsCurrencyOpen}
          selectedDebtId={selectedDebtId}
          setSelectedDebtId={setSelectedDebtId}
          isRecipientsOpen={isRecipientsOpen}
          setIsRecipientsOpen={setIsRecipientsOpen}
          customRecipientId={customRecipientId}
          setCustomRecipientId={setCustomRecipientId}
          goDetailed={goDetailed}
        />
      )}
    </Page>
  )
}

export default SummaryBalance
