import cx from 'classnames'
import { useState, useRef, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { closeApp } from '../utils'

import { Page, Header, Tabs } from '../kit'

import { useGetSummary, useGetSummarySheetRebuild } from '../api'
import { useInit, useFilter, useFeedback, useSummary } from '../hooks'
import { TUserId } from '../types'

import { Summary, Balance, Settings, TSettingsInner } from '../pages'

type TTab = 'summary' | 'balance' | 'settings'

export const Home = ({ tab }: {
  tab: TTab
}) => {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const { isFilterOpen, closeFilter } = useFilter()

  const { data: summary } = useGetSummary()
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

  const [settingsInner, setSettingsInner] = useState<TSettingsInner>(null)

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
        || (tab === 'settings' && (() => {
          if (settingsInner) {
            setSettingsInner(null)
          } else {
            history.back()
          }
        }))
        || closeApp
      } />

      {!(
        tab === 'summary' && isFilterOpen ||
        tab === 'balance' && isSelectedDebt ||
        tab === 'balance' && isCurrencyOpen ||
        tab === 'settings' && !!settingsInner
      ) && (
        <Tabs
          className="sticky top-0 mb-[6px] pb-[2px] pt-2 bg-bg2 z-[1]"
          tabs={[
            {
              title: t('expenses'),
              isActive: tab === 'summary',
              onClick: selectTab('summary'),
            },
            {
              title: t('balance'),
              isActive: tab === 'balance',
              onClick: selectTab('balance'),
            },
            {
              title: t('settings'),
              isActive: tab === 'settings',
              onClick: selectTab('settings'),
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

      {tab === 'settings' && (
        <Settings
          settingsInner={settingsInner}
          setSettingsInner={setSettingsInner}
        />
      )}
    </Page>
  )
}
