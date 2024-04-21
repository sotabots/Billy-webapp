import cx from 'classnames'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TTransaction } from '../types'

import Button from '../kit/Button'
import Panel from '../kit/Panel'
import Pie from '../kit/Pie'
import Category from '../kit/Category'
import DateMark from '../kit/DateMark'
import Transaction from '../kit/Transaction'
import RadioButtons from '../kit/RadioButtons'
import DatePicker from '../kit/DatePicker'

import { closeApp } from '../utils'

import { useStore } from '../store'
import { useTotal } from '../hooks'

import { ReactComponent as FilterIcon } from '../assets/filter.svg'
import { ReactComponent as FilterActiveIcon } from '../assets/filter-active.svg'


function History({
  isFilterOpen,
  setIsFilterOpen,
  isCompactPie,
  goDetailedSummary
}: {
  isFilterOpen: boolean
  setIsFilterOpen: (isFilterOpen: boolean) => void
  isCompactPie: boolean
  goDetailedSummary: () => void
}) {
  const { t } = useTranslation()

  const { isDebug, transactions } = useStore()

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

  const isFilterActive =
    totalSetting.value !== totalSettingDefault.value ||
    periodSetting.value !== periodSettingDefault.value

  const isArrows = periodSetting.value === 'MONTH' || periodSetting.value === 'WEEK'

  const applyFilter = () => {
    setIsFilterOpen(false)
  }

  const [fromTime, setFromTime] = useState<null | number>(null)
  const [toTime, setToTime] = useState<null | number>(null)

  const { totalFormatted, totalCategories } = useTotal()

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

  return (
    <>
      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            {isDebug && (
            <Panel>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  <h3>
                    {({
                      'ALL_CHAT': t('total'),
                      'ONLY_MINE': 'My Total',
                    })[totalSetting.value] || ''}
                  </h3>
                  <div
                    className={cx(
                      'text-[16px] leading-[24px] text-[#0E73F6] font-semibold transition-all',
                      !isCompactPie && 'opacity-0'
                    )}>
                    {totalFormatted}
                  </div>
                </div>
                {isDebug &&
                  <Button
                    theme="clear"
                    className="flex items-center justify-center w-8 h-8"
                    onClick={() => { setIsFilterOpen(true) }}
                    text={
                      isFilterActive
                        ? <FilterActiveIcon />
                        : <FilterIcon />
                    }
                  />
                }
              </div>
              <div className="flex flex-col gap-4">
                <Pie
                  isCompact={isCompactPie}
                  title={totalFormatted}
                  period={periodSetting.value}
                  slices={totalCategories}
                  onLeft={isArrows ? () => {} : null}
                  onRight={isArrows ? () => {} : null}
                />
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {totalCategories.map(item => (
                    <Category categoryKey={item.categoryKey} amountFormatted={item.amountFormatted} />
                  ))}
                </div>
              </div>
            </Panel>
            )}

            <Panel>
              <div className="flex flex-col gap-4">
                <h3>{t('transactions')}</h3>
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
              onClick={goDetailedSummary}
            />
          </div>

          <Button
            isBottom
            text={t('close')}
            onClick={closeApp}
          />
        </>
      )}

      {isFilterOpen && (
        <>
          <h2 className="mb-2 px-4 pt-[2px] pb-[6px]">{t('Filter')}</h2>
          <Panel>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3>Spending</h3>
                <RadioButtons
                  items={totalSettings}
                  activeItem={totalSetting}
                  onChange={(val) => { setTotalSetting(val) }}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3>Group by period</h3>
                <RadioButtons
                  items={periodSettings}
                  activeItem={periodSetting}
                  onChange={(val) => { setPeriodSetting(val) }}
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
            </div>
          </Panel>

          <Button
            isBottom
            text={t('Apply')}
            onClick={applyFilter}
          />
        </>
      )}

    </>
  )
}

export default History
