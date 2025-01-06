import cx from 'classnames'
import { useState, useRef, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useFilter, useFeedback, useSummary, useGetSummary, useGetSummarySheetRebuild, useGetChat /*, useStore */ } from '../hooks'
import { Page, Header, CustomHeader, Button } from '../kit'
import { Summary, Balance, Settings, TSettingsInner } from '../pages'
import { TUserId } from '../types'

import { ReactComponent as SettingsIcon } from '../assets/settings.svg'

type TTab = 'summary' | 'balance' | 'settings'

export const Home = ({ tab }: {
  tab: TTab
}) => {
  useInit()

  // const { isDebug } = useStore()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const { isFilterOpen, closeFilter } = useFilter()

  const { data: chat } = useGetChat()
  const { data: summary } = useGetSummary()
  const getSummarySheetRebuild = useGetSummarySheetRebuild()
  const { debtCurrencyIds, debts } = useSummary()

  const [selectedDebtId, setSelectedDebtId] = useState<null | string>(null)
  const isSelectedDebt = selectedDebtId !== null
  const [isRecipientsOpen, setIsRecipientsOpen] = useState<boolean>(false)
  const [customRecipientId, setCustomRecipientId] = useState<null | TUserId>(null)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)

  const [isCompactPie, setIsCompactPie] = useState<boolean>(true) // todo: false?

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
      <Header todoRemove onBack={
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
        || undefined
      } />

      {tab === 'summary' && (
        <>
          {!isFilterOpen &&
            <CustomHeader
              backText={t('chat.chats')}
              onBack={() => { navigate('/profile') }}
              center={chat?.name}
              right={
                <Button
                  wrapperClassName="w-6 h-6"
                  className="text-icon"
                  onClick={selectTab('settings')}
                >
                  <SettingsIcon className="w-6 h-6" />
                </Button>
              }
            />
          }
          <Summary
            isCompactPie={isCompactPie}
            goDetailed={goDetailed}
          />
        </>
      )}

      {tab === 'balance' && (
        <>
          {!isSelectedDebt && !isCurrencyOpen &&
            <CustomHeader
              center={t('balance.title')}
            />
          }
          <Balance
            isCurrencyOpen={isCurrencyOpen}
            setIsCurrencyOpen={setIsCurrencyOpen}
            selectedDebtId={selectedDebtId}
            setSelectedDebtId={setSelectedDebtId}
            isRecipientsOpen={isRecipientsOpen}
            setIsRecipientsOpen={setIsRecipientsOpen}
            customRecipientId={customRecipientId}
            setCustomRecipientId={setCustomRecipientId}
          />
        </>
      )}

      {tab === 'settings' && (
        <>
          {!settingsInner &&
            <CustomHeader
              center={t('settings.title')}
            />
          }
          <Settings
            settingsInner={settingsInner}
            setSettingsInner={setSettingsInner}
          />
        </>
      )}
    </Page>
  )
}
