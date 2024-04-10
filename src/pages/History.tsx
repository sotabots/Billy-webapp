import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Panel from '../kit/Panel'
import Pie from '../kit/Pie'
import Category from '../kit/Category'
import DateMark from '../kit/DateMark'
import Transaction from '../kit/Transaction'
import RadioButtons from '../kit/RadioButtons'
import DatePicker from '../kit/DatePicker'

import { closeApp } from '../utils'

// import { useStore } from '../store'
// import { useCurrencies } from '../hooks'
// import { formatAmount } from '../utils'

import { ReactComponent as FilterIcon } from '../assets/filter.svg'
import { ReactComponent as FilterActiveIcon } from '../assets/filter-active.svg'


function History({ isFilterOpen, setIsFilterOpen, isCompactPie}: {
  isFilterOpen: boolean
  setIsFilterOpen: (isFilterOpen: boolean) => void
  isCompactPie: boolean
}) {
  const { t } = useTranslation()

  // const { chat } = useStore()
  // const { getCurrencyById } = useCurrencies()

  // if (!summary) {
  //   return null
  // }

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
      title: 'All time',
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

  const title = '$38,654.55'
  const [ts1, setTs1] = useState<null | number>(null)
  const [ts2, setTs2] = useState<null | number>(null)

  return (
    <>
      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <Panel>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  <h3>
                    {({
                      'ALL_CHAT': 'Total',
                      'ONLY_MINE': 'My Total',
                    })[totalSetting.value] || ''}
                  </h3>
                  <div
                    className={cx(
                      'text-[16px] leading-[24px] text-[#0E73F6] font-semibold transition-all',
                      !isCompactPie && 'opacity-0'
                    )}>
                    {title}
                  </div>
                </div>
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
              </div>
              <div className="flex flex-col gap-4">
                <Pie
                  isCompact={isCompactPie}
                  title={title}
                  period={periodSetting.value}
                  onLeft={isArrows ? () => {} : null}
                  onRight={isArrows ? () => {} : null}
                />
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {['#82C4B8', '#B89AE4', '#FFBE7C', '#85BADA', '#FF9D97'].map(_ => (
                    <Category key={_} color={_} />
                  ))}
                </div>
              </div>
            </Panel>
            <Panel>
              <div className="flex flex-col gap-4">
                <h3>Transactions</h3>
                <div className="flex flex-col gap-3">
                  <DateMark time={Date.now()} />
                  <Transaction />
                  <DateMark time={Date.now() - 24 * 60 * 60 * 1000} />
                  <Transaction />
                  <Transaction />
                  <DateMark time={Date.now() - 200 * 24 * 60 * 60 * 1000} />
                  <Transaction />
                  <Transaction />
                </div>
              </div>
            </Panel>
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
                    timestamp={ts1}
                    onChange={setTs1}
                  />
                  <span>−</span>
                  <DatePicker
                    className="w-[50%]"
                    placeholder="Select a last date"
                    timestamp={ts2}
                    onChange={setTs2}
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
