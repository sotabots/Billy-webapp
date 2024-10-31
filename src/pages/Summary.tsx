import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button, Panel, Pie, Category, DateMark, Transaction, RadioButtons, DatePicker } from '../kit'

import { useStore, useTotal, useFilter, useFeedback, useUser } from '../hooks'
import { TFilterPeriod, TFilterTotal } from '../types'

import { ReactComponent as FilterIcon } from '../assets/filter.svg'
import { ReactComponent as FilterActiveIcon } from '../assets/filter-active.svg'
import { ReactComponent as ProPie } from '../assets/pro-pie.svg'
import { ReactComponent as ProBadgeRotate } from '../assets/pro-badge-rotate.svg'

export const Summary = ({
  isCompactPie,
  goDetailed
}: {
  isCompactPie: boolean
  goDetailed: () => void
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()
  const { isPro } = useUser()

  const { isDebug, setTxId, setIsEditTx, setPaywallSource, setPaywallFrom } = useStore()

  const {
    isFilterOpen,
    openFilter,
    applyFilter,
    filterTotalPre,
    filterPeriodPre,
    setFilterTotalPre,
    setFilterPeriodPre,
    filterTotal,
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

  return (
    <>
      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <Panel className={cx(!isPro && '!pb-4')}>
              {!isPro &&
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[18px] leading-[24px] font-semibold">{t('unlockCategories')}</div>
                    <div className="mt-1 text-[14px] leading-[20px] text-[#5B6871] dark:text-[#B0BABF]">{t('analyzeCategories')}</div>
                    <Button
                      wrapperClassName="mt-4"
                      theme="clear"
                      className="bg-blue py-1 px-3 rounded-[6px] text-[#F6F8F9] text-[14px] leading-[24px] font-semibold"
                      text={t('unlock')}
                      onClick={() => {
                        setPaywallSource('summary_donut')
                        setPaywallFrom('summary')
                        navigate('/paywall')
                      }}
                    />
                  </div>
                  <Button
                    theme="clear"
                    className="relative w-[104px] h-[104px]"
                    text={
                      <>
                        <ProPie className="-m-2 w-[120px] h-[120px]" />
                        <ProBadgeRotate className="absolute left-[50%] translate-x-[-50%] top-[64%] w-[73px] h-[35px]" />
                      </>
                    }
                    onClick={() => {
                      setPaywallSource('summary_donut')
                      setPaywallFrom('summary')
                      navigate('/paywall')
                    }}
                  />
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
                          'text-[16px] leading-[24px] text-[#0E73F6] font-semibold transition-all',
                          !isCompactPie && 'opacity-0'
                        )}>
                        {totalFormatted}
                      </div>
                    </div>
                    <Button
                      theme="clear"
                      className="flex items-center justify-center w-8 h-8"
                      onClick={() => {
                        openFilter()
                        feedback('press_filter_total_web')
                      }}
                      text={
                        isFilterActive
                          ? <FilterActiveIcon />
                          : <FilterIcon />
                      }
                    />
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
                    <div className="flex flex-wrap gap-x-1 gap-y-2">
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

            <Panel className="!mt-0">
              <div className="flex flex-col gap-4">
                <h3>{t('history')}</h3>
                <div className="flex flex-col gap-3">
                  {txGroups.map((txGroup, i) => (
                    <>
                      <DateMark
                        key={`DateMark-${i}`}
                        time={txGroup.time}
                      />
                      {txGroup.txs.map(tx => (
                        <Transaction
                          key={`Transaction-${tx._id}`}
                          tx={tx}
                        />
                      ))}
                    </>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          <div className="mb-4 flex justify-center">
            <Button
              theme="text"
              text={t('detailedSummary')}
              onClick={() => {
                goDetailed()
                feedback('press_details_total_web')
              }}
            />
          </div>

          <Button
            isBottom
            text={t('addTransaction')}
            onClick={() => {
              setTxId('NEW')
              setIsEditTx(true)
              navigate('/')
              feedback('add_expense_total_web', {
                num_transaction: filteredTransactions.length
              })
            }}
          />
        </>
      )}

      {isFilterOpen && (
        <>
          <h2 className="mb-2 px-4 pt-[2px] pb-[6px]">{t('filter')}</h2>
          <Panel>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3>{t('spending')}</h3>
                <RadioButtons
                  items={radioItemsTotal}
                  activeValue={filterTotalPre}
                  onChange={(val: string) => { setFilterTotalPre(val as TFilterTotal) }}
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
            isBottom
            text={t('apply')}
            onClick={applyFilter}
          />
        </>
      )}

    </>
  )
}
