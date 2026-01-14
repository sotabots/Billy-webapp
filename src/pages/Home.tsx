import cx from 'classnames'
import { useEffect, useState, useRef, UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useFilter, useFeedback, useSummary, useGetSummary, useGetSummarySheetRebuild, useGetChat, /*, useStore */ } from '../hooks'
import { Page, Header, CustomHeader, Button } from '../kit'
import { Summary, UserBalance, ChatSettings, TSettingsInner } from '../pages'
import { TUserId } from '../types'

import { ReactComponent as SettingsIcon } from '../assets/settings.svg'
import { ChatBalance } from './ChatBalance'

type TTab = 'summary' | 'user-balance' | 'chat-balance' | 'settings'

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

  const [selectedChatBalanceUserId, setSelectedChatBalanceUserId] = useState<null | TUserId>(null)
  const [selectedChatBalanceDebtId, setSelectedChatBalanceDebtId] = useState<null | string>(null)
  const isSelectedChatBalanceDebt = selectedChatBalanceDebtId !== null
  const [isChatBalanceRecipientsOpen, setIsChatBalanceRecipientsOpen] = useState<boolean>(false)
  const [chatBalanceCustomRecipientId, setChatBalanceCustomRecipientId] = useState<null | TUserId>(null)
  const [isChatBalanceCurrencyOpen, setIsChatBalanceCurrencyOpen] = useState(false)

  const [isCompactPie, setIsCompactPie] = useState<boolean>(true)
  const [isLoadingSheet, setIsLoadingSheet] = useState<boolean>(false)

  const screenRef = useRef<HTMLDivElement>(null)

  const resetChatBalanceState = () => {
    setSelectedChatBalanceUserId(null)
    setSelectedChatBalanceDebtId(null)
    setIsChatBalanceRecipientsOpen(false)
    setChatBalanceCustomRecipientId(null)
    setIsChatBalanceCurrencyOpen(false)
  }

  useEffect(() => {
    // Home component instance is reused between tabs/routes, so we must reset
    // chat-balance internal state when leaving that tab.
    if (tab !== 'chat-balance') {
      resetChatBalanceState()
    }
  }, [tab])

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
    if (newTab === 'user-balance') {
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

  const goDetailed = async () => {
    if (summary && summary.url) {
      getSummarySheetRebuild()
      window.open(summary.url, '_blank')
      return
    }

    setIsLoadingSheet(true)
    const sheetUrl = await getSummarySheetRebuild()
    window.open(sheetUrl, '_blank')
    setIsLoadingSheet(false)
  }

  const [settingsInner, setSettingsInner] = useState<TSettingsInner>(null)

  return (
    <Page
      _ref={screenRef}
      className={cx(tab === 'user-balance' && isCurrencyOpen && '!bg-bg')}
      onScroll={onScroll}
    >
      <Header todoRemove onBack={
        (tab === 'summary' && isFilterOpen && (() => {
          closeFilter()
        }))
        || (tab === 'user-balance' && isCurrencyOpen) && (() => {
          setIsCurrencyOpen(false)
        })
        || (tab === 'user-balance' && isRecipientsOpen && (() => {
          setIsRecipientsOpen(false)
        }))
        || (tab === 'user-balance' && isSelectedDebt && (() => {
          setSelectedDebtId(null)
          setCustomRecipientId(null)
        }))
        || (tab === 'chat-balance' && isChatBalanceCurrencyOpen) && (() => {
          setIsChatBalanceCurrencyOpen(false)
        })
        || (tab === 'chat-balance' && isChatBalanceRecipientsOpen) && (() => {
          setIsChatBalanceRecipientsOpen(false)
        })
        || (tab === 'chat-balance' && isSelectedChatBalanceDebt) && (() => {
          setSelectedChatBalanceDebtId(null)
          setChatBalanceCustomRecipientId(null)
        })
        || (tab === 'chat-balance' && selectedChatBalanceUserId !== null) && (() => {
          setSelectedChatBalanceUserId(null)
          setSelectedChatBalanceDebtId(null)
          setIsChatBalanceRecipientsOpen(false)
          setChatBalanceCustomRecipientId(null)
          setIsChatBalanceCurrencyOpen(false)
        })
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
                  className="relative text-icon"
                  onClick={selectTab('settings')}
                >
                  <SettingsIcon className="w-6 h-6" />
                  {!!chat && !chat.is_admin &&
                    <div className="absolute top-0 right-0 bg-red rounded-full w-3 h-3 border-[2px] border-bg2" />
                  }
                </Button>
              }
            />
          }
          <Summary
            isCompactPie={isCompactPie}
            goDetailed={goDetailed}
            isLoadingSheet={isLoadingSheet}
          />
        </>
      )}

      {tab === 'user-balance' && (
        <UserBalance
          isCurrencyOpen={isCurrencyOpen}
          setIsCurrencyOpen={setIsCurrencyOpen}
          selectedDebtId={selectedDebtId}
          setSelectedDebtId={setSelectedDebtId}
          isRecipientsOpen={isRecipientsOpen}
          setIsRecipientsOpen={setIsRecipientsOpen}
          customRecipientId={customRecipientId}
          setCustomRecipientId={setCustomRecipientId}
        />
      )}

      {tab === 'chat-balance' && (
        <>
          {selectedChatBalanceUserId === null && (
            <>
              <CustomHeader
                center={t('chatBalance.title')}
              />
              <ChatBalance
                onUserClick={(userId: TUserId) => {
                  setSelectedChatBalanceUserId(userId)
                  setSelectedChatBalanceDebtId(null)
                  setIsChatBalanceRecipientsOpen(false)
                  setChatBalanceCustomRecipientId(null)
                  setIsChatBalanceCurrencyOpen(false)
                }}
              />
            </>
          )}

          {selectedChatBalanceUserId !== null && (
            <UserBalance
              isCurrencyOpen={isChatBalanceCurrencyOpen}
              setIsCurrencyOpen={setIsChatBalanceCurrencyOpen}
              selectedDebtId={selectedChatBalanceDebtId}
              setSelectedDebtId={setSelectedChatBalanceDebtId}
              isRecipientsOpen={isChatBalanceRecipientsOpen}
              setIsRecipientsOpen={setIsChatBalanceRecipientsOpen}
              customRecipientId={chatBalanceCustomRecipientId}
              setCustomRecipientId={setChatBalanceCustomRecipientId}
              focusUserId={selectedChatBalanceUserId}
            />
          )}
        </>
      )}

      {tab === 'settings' && (
        <>
          {!settingsInner &&
            <CustomHeader
              center={t('chatSettings.title')}
            />
          }
          <ChatSettings
            settingsInner={settingsInner}
            setSettingsInner={setSettingsInner}
          />
        </>
      )}
    </Page>
  )
}
