import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'

import { closeApp } from '../utils'

import { useInit } from '../hooks'
// import { useStore } from '../store'
// import { useCurrencies } from '../hooks'
// import { formatAmount } from '../utils'


function History() {
  useInit()

  const { t } = useTranslation()

  // const { chat } = useStore()
  // const { getCurrencyById } = useCurrencies()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // if (!summary) {
  //   return null
  // }

  const applyFilter = () => {
    setIsFilterOpen(false)
  }

  return (
    <Screen>
      <Header onBack={!isFilterOpen ? closeApp : () => { setIsFilterOpen(false) }} />

      {!isFilterOpen && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <Panel>
              <h3>{t('category')}</h3>
              <div className="mt-4 flex flex-col gap-4">
                ...
              </div>
            </Panel>
            <Panel>
              <h3>{t('Transactions')}</h3>
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

    </Screen>
  )
}

export default History
