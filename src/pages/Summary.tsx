// import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import SummaryItem from '../kit/SummaryItem'
import SummaryItemDetailed from '../kit/SummaryItemDetailed'

import { closeApp } from '../utils'

// import { decimals } from '../const'
// import { useInit } from '../hooks'
import { useStore } from '../store'
import { useCurrencies } from '../hooks'
// import { feedback, EVENT } from '../feedback'
// import { usePatchTransaction } from '../api'
// import { formatAmount } from '../utils'
// import type { TShare } from '../types'

function Summary() {
  const { t } = useTranslation()

  const { summary } = useStore()
  const { getCurrencyById } = useCurrencies()

  const [selectedId, setSelectedId] = useState<null | number>(null)
  const isSelected = selectedId !== null
  const selectedSummaryItem = (summary?.items || []).find(summaryItem => summaryItem._id === selectedId)
  const selectedSummaryItemCurrency = selectedSummaryItem ? getCurrencyById(selectedSummaryItem.currency_id) : undefined

  const [isBusy, setIsBusy] = useState(false)

  const currencyIds = !summary?.items
    ? []
    : [...(new Set(summary.items.map(item => item.currency_id)))]

  /*
  useInit()
  const navigate = useNavigate()
  const { currencies, transaction, setTransaction, setSuccess, setTxPatchError } = useStore()

  const patchTransaction = usePatchTransaction()

  */

  if (!summary) {
    return null
  }

  /*

  const save = async () => {
    const confirmedTransaction = {
      ...transaction,
      is_confirmed: true
    }
    setIsBusy(true)
    try {
      await feedback(EVENT.SEND_TRANSACTION)
      console.log(JSON.stringify(confirmedTransaction, null, 2))
      const resJson = await patchTransaction(confirmedTransaction)
      console.log('patch res json', resJson)
      setSuccess(true)
      setTimeout(() => {
        window.Telegram?.WebApp.close()
      }, 2300)
    } catch (e) {
      setSuccess(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }
  */

  const settleUp = () => {
    setIsBusy(true)
    try {
      // todo
    } catch (e) {
      // todo
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Screen>
      <Header onBack={!isSelected ? closeApp : () => { setSelectedId(null) }} />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">
          {!isSelected ? t('chatBalances') : `${t('settleUpBy')} ${selectedSummaryItemCurrency?.symbol}`}
        </h2>
        {!isSelected && (
          <Button
            theme="text"
            text={t('detailedSummary')}
            onClick={() => {}/* () => { navigate('/select-currency') }*/}
          />
        )}
      </div>

      {!isSelected && summary?.items && summary.items.length > 0 && (
        <div className="flex flex-col gap-2">
        {currencyIds.map((currencyId, i) => (
          <Panel key={`Panel-${i}`}>
            <h3>{t('summaryBy')} {getCurrencyById(currencyId)?.symbol || currencyId}</h3>
            <div className="mt-4 flex flex-col gap-4">
              {summary.items.filter(item => item.currency_id === currencyId).map((summaryItem, j) => (
                <SummaryItem
                  key={`SummaryItem-${i}-${j}`}
                  {...summaryItem}
                  onClick={() => { setSelectedId(summaryItem._id) }}
                />
              ))}
            </div>
          </Panel>
        ))}
        </div>
      )}

      {!selectedId && summary?.items && summary.items.length === 0 && (
        // todo lottie
        <div>{t('allSettledUp')}</div>
        // todo link
      )}

      {selectedId && selectedSummaryItem && (
        <Panel>
          <SummaryItemDetailed {...selectedSummaryItem} />
        </Panel>
      )}

      <Button
        isBottom
        text={!selectedId ? t('close') : t('settleUp')}
        onClick={!selectedId ? closeApp : settleUp}
        isBusy={isBusy}
      />
    </Screen>
  )
}

export default Summary
