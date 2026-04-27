import cx from 'classnames'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useStore, useTotal, useFilter, useFeedback, useUser, useGetVoiceLimit, useGetSummary, useUsers, useGetChat } from '../hooks'
import { Button, Panel, Pie, Category, DateMark, Transaction, RadioButtons, DatePicker, CurrencyAmount, Avatar } from '../kit'
import { TFilterPeriod, TFilterTotal } from '../types'
import { getPayerUserIdForPayee, getTransactionEditPath } from '../utils'

import { ReactComponent as ChevronIcon } from '../assets/chevron.svg'
import { ReactComponent as FilterIcon } from '../assets/filter.svg'
import { ReactComponent as FilterActiveIcon } from '../assets/filter-active.svg'
import { ReactComponent as ProPie } from '../assets/pro-pie.svg'
import { ReactComponent as ProBadgeRotate } from '../assets/pro-badge-rotate.svg'
import { ReactComponent as ExternalIcon } from '../assets/external.svg'

export const Summary = ({
  isCompactPie,
  goDetailed,
  isLoadingSheet,
}: {
  isCompactPie: boolean
  goDetailed: () => void
  isLoadingSheet?: boolean
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()
  const { isPro, me } = useUser()
  const { users } = useUsers()
  const { data: chat } = useGetChat()

  const { isDebug, setTxId, setIsEditTx, setPaywallSource, setPaywallFrom } = useStore()

  const { data: voiceLimit } = useGetVoiceLimit()

  const {
    isFilterOpen,
    openFilter,
    applyFilter,
    filterTotalPre,
    filterPeriodPre,
    setFilterTotalPre,
    setFilterPeriodPre,
    filterTotal,
    setFilterTotal,
    filterPeriod,
    fromTime, setFromTime,
    toTime, setToTime,
    isFilterActive,
    isArrows,
    txGroups,
    filteredTransactions,
  } = useFilter()
  const { totalFormatted, totalCategories } = useTotal({ filteredTransactions })

  const radioItemsTotal = [
    {
      title: t('allChat'),
      value: 'ALL_CHAT',
    },
    {
      title: t('onlyMine'),
      value: 'ONLY_MINE'
    },
  ]

  const radioItemsPeriod = [
    {
      title: t('allTime'),
      value: 'ALL_TIME',
    },
    {
      title: t('month'),
      value: 'MONTH'
    },
    {
      title: t('week'),
      value: 'WEEK'
    },
    {
      title: t('custom'),
      value: 'CUSTOM'
    },
  ]

  const { data: summary } = useGetSummary()

  const balanceAmount: undefined | number = summary?.balance.total.value.amount
  const usersWithNonZeroBalance = useMemo(() => users.filter(user => (user.balance?.amount ?? 0) !== 0), [users])

  const payerUserIdForMe = useMemo(() => getPayerUserIdForPayee(chat?.pay_for, me?._id ?? null), [chat?.pay_for, me?._id])
  const payerUser = payerUserIdForMe ? users.find(u => u._id === payerUserIdForMe) : undefined
  const isMePayee = !!payerUser

  const payerShortenedName = payerUser?.shortened_name || payerUser?.first_name || ''
  const payerBalance = payerUser?.balance
  const payerBalanceAmount = payerBalance?.amount ?? 0
  const payerTitleKey = payerBalanceAmount >= 0 ? 'userBalance.owedToUser' : 'userBalance.userOwes'
  const [isConfirmedOnly, setIsConfirmedOnly] = useState(true)
  const unconfirmedTransactions = useMemo(
    () => filteredTransactions.filter(tx => !tx.is_confirmed && !tx.is_canceled),
    [filteredTransactions]
  )
  const displayedTxGroups = useMemo(
    () => txGroups
      .map(txGroup => ({
        ...txGroup,
        txs: isConfirmedOnly
          ? txGroup.txs.filter(tx => tx.is_confirmed && !tx.is_canceled)
          : txGroup.txs
      }))
      .filter(txGroup => txGroup.txs.length > 0),
    [isConfirmedOnly, txGroups]
  )
  return (
    <>
      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <div className="w-full flex items-center gap-2 px-4">
            <Button
                wrapperClassName="w-full"
                className="w-full"
                onClick={() => { navigate('/chat-balance') }}
              >
                <Panel className="!py-3 pr-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 text-left">
                      <div className="text-[12px] leading-[16px] font-semibold text-textSec">
                        {t('chat.chatBalance')}
                      </div>
                      <div className="flex items-center justify-start h-6 pl-1">
                        {[
                          ...(usersWithNonZeroBalance.length > 5 ? usersWithNonZeroBalance.slice(0, 4) : usersWithNonZeroBalance),
                          ...(usersWithNonZeroBalance.length > 5 ? [undefined] : [])
                        ].map(user =>
                          <div
                            key={`user-${user?._id}`}
                            className="-ml-[5px] w-[22px] h-[22px] bg-bg p-[1px] rounded-full"
                          >
                            <Avatar
                              size={20}
                              user={user}
                              text={user === undefined ? `+${usersWithNonZeroBalance.length - 4}` : undefined}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronIcon className="w-4 h-4 text-[#6E7C87]" />
                  </div>
                </Panel>
              </Button>
              <Button
                wrapperClassName="w-full"
                className="w-full"
                onClick={
                  (isMePayee ? !!payerBalanceAmount : !!balanceAmount)
                    ? () => { navigate('/user-balance') }
                    : () => { /* */ }
                }
              >
                <Panel className="!py-3 pr-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 text-left">
                      <div
                        className={cx(
                          'text-[12px] leading-[16px] font-semibold',
                          isMePayee ? 'text-blue' : 'text-textSec',
                        )}
                      >
                        {isMePayee
                          ? (
                            <span className="flex items-center gap-2">
                              <span className="w-[18px] h-[18px] rounded-full overflow-hidden">
                                <Avatar size={18} user={payerUser} />
                              </span>
                              <span className="truncate">
                                {t(payerTitleKey, { name: payerShortenedName || '—' })}
                              </span>
                            </span>
                          )
                          : t((!!balanceAmount && balanceAmount > 0) ? 'chat.myCredits' : 'chat.myDebts')}
                      </div>
                      {!!(isMePayee ? payerBalance : summary?.balance.total.value) &&
                        <CurrencyAmount
                          className={cx(
                            'text-[18px] leading-[24px] font-semibold',
                            isMePayee && 'text-blue'
                          )}
                          currencyAmount={(isMePayee ? payerBalance : summary?.balance.total.value)!}
                        />
                      }
                    </div>
                    {!!(isMePayee ? payerBalanceAmount : balanceAmount) &&
                      <ChevronIcon className="w-4 h-4 text-[#6E7C87]" />
                    }
                  </div>
                </Panel>
              </Button>
            </div>

            {!isPro && voiceLimit !== -1 &&
              <Panel className="!pb-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3>
                      {t('chat.getProTitle')}
                      <span className="text-red">
                        {' '}
                        {voiceLimit === undefined ? '..' : voiceLimit}
                        {' '}
                        {t('chat.getProTitlePcs')}
                      </span>
                    </h3>
                    <div className="text-[14px] leading-[20px]">
                      {t('chat.getProDescription')}
                    </div>
                  </div>
                  <Button
                    className="block px-3 py-1 bg-pro text-textButton rounded-[6px] text-[14px] leading-[24px] font-semibold"
                    onClick={() => {
                      setPaywallSource('summary_donut')
                      setPaywallFrom('summary')
                      navigate('/paywall')
                    }}
                  >
                    {t('chat.getPro')}
                  </Button>
                </div>
              </Panel>
            }

            {isPro &&
            <Panel className={cx(!isPro && '!pb-4')}>
              {!!false && !isPro &&
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[18px] leading-[24px] font-semibold">{t('unlockCategories')}</div>
                    <div className="mt-1 text-[14px] leading-[20px] text-[#5B6871] dark:text-[#B0BABF]">{t('analyzeCategories')}</div>
                    <Button
                      wrapperClassName="mt-4"
                      className="bg-blue py-1 px-3 rounded-[6px] text-[#F6F8F9] text-[14px] leading-[24px] font-semibold"
                      onClick={() => {
                        setPaywallSource('summary_donut')
                        setPaywallFrom('summary')
                        navigate('/paywall')
                      }}
                    >
                      {t('unlock')}
                    </Button>
                  </div>
                  <Button
                    className="relative w-[104px] h-[104px]"
                    onClick={() => {
                      setPaywallSource('summary_donut')
                      setPaywallFrom('summary')
                      navigate('/paywall')
                    }}
                  >
                    <>
                      <ProPie className="-m-2 w-[120px] h-[120px]" />
                      <ProBadgeRotate className="absolute left-[50%] translate-x-[-50%] top-[64%] w-[73px] h-[35px]" />
                    </>
                  </Button>
                </div>
              }
              {isPro &&
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1">
                      <h3>
                        {filterTotal === 'ALL_CHAT' && t('total')}
                        {filterTotal === 'ONLY_MINE' && t('myTotal')}
                      </h3>
                      <div
                        className={cx(
                          'text-[16px] leading-[24px] text-textSec2 font-semibold transition-all',
                          !isCompactPie && 'opacity-0'
                        )}>
                        {totalFormatted}
                      </div>
                    </div>
                    {isDebug && (
                    <Button
                      className="flex items-center justify-center w-8 h-8"
                      onClick={() => {
                        openFilter()
                        feedback('press_filter_total_web')
                      }}
                    >
                      {
                        isFilterActive
                          ? <FilterActiveIcon />
                          : <FilterIcon />
                      }
                    </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <Pie
                      isCompact={isCompactPie}
                      title={totalFormatted}
                      period={filterPeriod}
                      slices={totalCategories}
                      onLeft={isArrows ? () => { /* */ } : null}
                      onRight={isArrows ? () => { /* */ } : null}
                    />
                    <div className="flex flex-wrap gap-x-1 gap-y-1">
                      {totalCategories.map(item => (
                        <Category
                          key={item.categoryKey}
                          categoryKey={item.categoryKey}
                          amountFormatted={item.amountFormatted}
                        />
                      ))}
                    </div>
                  </div>
                </>
              }
            </Panel>
            }

            {!!unconfirmedTransactions.length && (
            <Button
              wrapperClassName="w-full"
              className="w-full text-left"
              onClick={() => {
                navigate('/confirm-transactions')
              }}
            >
              <div className="mx-0 flex items-center justify-between rounded-[16px] bg-bg py-4 pl-4 pr-3">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="truncate">{t('confirmTransactions')}</h3>
                  <div className="flex h-6 min-w-6 items-center justify-center rounded-[16px] bg-separator px-2 text-[12px] leading-4 font-semibold text-textSec2">
                    {unconfirmedTransactions.length}
                  </div>
                </div>
                <ChevronIcon className="h-4 w-4 -rotate-90 text-icon" />
              </div>
            </Button>
            )}

            <Panel className="!mt-0 !pb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3>{t('history')}</h3>
                  <Button
                    theme="text"
                    disabled={isLoadingSheet}
                    onClick={() => {
                      goDetailed()
                      feedback('press_details_total_web')
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <h3 className="text-blue">
                        {isLoadingSheet ? t('chat.excel_loading') : t('chat.excel')}
                      </h3>
                      {!isLoadingSheet && <ExternalIcon className="w-4 h-4" />}
                      {isLoadingSheet && (
                        <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    className={cx(
                      'flex h-8 items-center gap-1 rounded-[30px] bg-separator pl-3 pr-2 text-[14px] leading-6 font-semibold text-textSec',
                      !isConfirmedOnly && 'opacity-70',
                    )}
                    onClick={() => { setIsConfirmedOnly(!isConfirmedOnly) }}
                  >
                    <>
                      <span>{t('confirmedTransactions')}</span>
                      <ChevronIcon className={cx('h-4 w-4 transition-all', isConfirmedOnly && 'rotate-180')} />
                    </>
                  </Button>
                  <Button
                    className={cx(
                      'h-8 rounded-[30px] bg-separator px-3 text-[14px] leading-6 font-semibold',
                      filterTotal === 'ONLY_MINE' ? 'text-textSec' : 'text-textSec2 opacity-70',
                    )}
                    onClick={() => {
                      setFilterTotal(filterTotal === 'ONLY_MINE' ? 'ALL_CHAT' : 'ONLY_MINE')
                    }}
                  >
                    {t('onlyMine')}
                  </Button>
                </div>
                <div className="flex flex-col gap-3">
                  {displayedTxGroups.length === 0 &&
                    <div className="text-textSec2">
                      {t('chat.noTransactions')}
                    </div>
                  }
                  {displayedTxGroups.length > 0 && displayedTxGroups.map((txGroup, i) => (
                    <div key={`txGroup-${txGroup.time}-${i}`} className="flex flex-col gap-2">
                      <DateMark
                        time={txGroup.time}
                        variant="plain"
                      />
                      {txGroup.txs.map(tx => (
                        <Transaction
                          key={`Transaction-${tx._id}`}
                          tx={tx}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          <Button
            theme="bottom"
            onClick={() => {
              setTxId('NEW')
              setIsEditTx(true)
              navigate(getTransactionEditPath('NEW'))
              feedback('add_expense_total_web', {
                num_transaction: filteredTransactions.length
              })
            }}
          >
            {t('addTransaction')}
          </Button>
        </>
      )}

      {isFilterOpen && (
        <>
          <h2 className="mb-2 px-4 pt-4 pb-[6px]">{t('filter')}</h2>
          <Panel>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3>{t('spending')}</h3>
                <RadioButtons
                  items={radioItemsTotal}
                  activeValue={filterTotalPre}
                  onChange={(val: string) => {
                    setFilterTotalPre(val as TFilterTotal)
                  }}
                />
              </div>
              {isDebug && (
              <div className="flex flex-col gap-3">
                <h3>{t('period')}</h3>
                <RadioButtons
                  items={radioItemsPeriod}
                  activeValue={filterPeriodPre}
                  onChange={(val: string) => { setFilterPeriodPre(val as TFilterPeriod) }}
                />
                <div className="flex items-center gap-1">
                  <DatePicker
                    className="w-[50%]"
                    placeholder="Select a first date"
                    timestamp={fromTime}
                    onChange={setFromTime}
                  />
                  <span>−</span>
                  <DatePicker
                    className="w-[50%]"
                    placeholder="Select a last date"
                    isRight
                    timestamp={toTime}
                    onChange={setToTime}
                  />
                </div>
              </div>
              )}
            </div>
          </Panel>

          <Button
            theme="bottom"
            onClick={applyFilter}
          >
            {t('apply')}
          </Button>
        </>
      )}

    </>
  )
}
