// import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Panel from '../kit/Panel'

import { closeApp } from '../utils'

// import { useStore } from '../store'
// import { useCurrencies } from '../hooks'
// import { formatAmount } from '../utils'


function History({ isFilterOpen, setIsFilterOpen }: {
  isFilterOpen: boolean
  setIsFilterOpen: (isFilterOpen: boolean) => void
}) {
  const { t } = useTranslation()

  // const { chat } = useStore()
  // const { getCurrencyById } = useCurrencies()

  // if (!summary) {
  //   return null
  // }

  const applyFilter = () => {
    setIsFilterOpen(false)
  }

  return (
    <>
      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <Panel>
              <h3>Total</h3>
              <div className="mt-4 flex flex-col gap-4">
                ...
              </div>
            </Panel>
            <Panel>
              <h3>Transactions</h3>
              <div className="mt-4 flex flex-col gap-4">
                ...
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
          <h2 className="pt-[2px] pb-[6px]">{t('filter')}</h2>
          <Panel>
            ...
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
