// import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import SummaryItem from '../kit/SummaryItem'

import { closeApp } from '../utils'

// import { decimals } from '../const'
// import { useInit } from '../hooks'
import { useStore } from '../store'
// import { feedback, EVENT } from '../feedback'
// import { usePatchTransaction } from '../api'
// import { formatAmount } from '../utils'
// import type { TShare } from '../types'

function Summary() {
  const { t } = useTranslation()

  const [isSelected, setIsSelected] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const { summary } = useStore()

  /*
  useInit()
  const navigate = useNavigate()
  const { currencies, transaction, setTransaction, setSuccess, setTxPatchError } = useStore()

  const patchTransaction = usePatchTransaction()

  if (!transaction) {
    return null
  }

  const currency = currencies.find(currency => currency._id === transaction.currency_id)

  const changeAmount = (share: TShare, amount: number) => {
    const shareIndex = transaction.shares.findIndex(s =>
      s.person_id === share.person_id
      && s.related_user_id === share.related_user_id
      && s.is_payer === share.is_payer
    )
    if (~shareIndex) {
      const updShares = [...transaction.shares]
      updShares[shareIndex].amount = amount
      setTransaction({
        ...transaction,
        shares: updShares
      })
    }
  }

  // todo: move out

  const payedShares = transaction.shares.filter(share => share.related_user_id && share.is_payer)
  const oweShares = transaction.shares.filter(share => share.related_user_id && !share.is_payer)

  const payedSum = payedShares.reduce((acc, item) => acc + item.amount, 0)
  const payedSumFormatted = formatAmount(payedSum)
  const oweSum = oweShares.reduce((acc, item) => acc + item.amount, 0)
  const oweSumFormatted = formatAmount(oweSum)

  const fromDecimals = (n: number) => Math.round(n * 10**decimals)

  const TOLERANCE = 0.01
  const isLacks = fromDecimals(oweSum) - fromDecimals(payedSum) >= fromDecimals(TOLERANCE)
  const isOverdo = fromDecimals(payedSum) - fromDecimals(oweSum) >= fromDecimals(TOLERANCE)
  const isBalanced = !isLacks && !isOverdo

  const isButtonDisabled = !isBalanced || !(payedSum > 0) || !(oweSum > 0) || !transaction.currency_id

  const payerIds = payedShares.map(share => share.related_user_id!)
  const oweIds = oweShares.map(share => share.related_user_id!)
  const isSelfPayers = payerIds.some(payerId => oweIds.includes(payerId))

  // const isSplitedEqually = oweShares.every(share => share.amount === oweShares[0].amount)
  const isSplitedEqually = false // todo

  const splitEqually = () => {
    // const newAmount = parseFloat((payedSum / oweShares.length).toFixed(decimals))
    const newAmount = parseFloat(
      (
        Math.floor((10**decimals * payedSum / oweShares.length)) / 10**decimals
      ).toFixed(decimals)
    )
    const newAmountUp = payedSum - (oweShares.length - 1) * newAmount

    const newShares = [...transaction.shares]
    let isFirstOweShare = false
    for (let newShare of newShares) {
      if (newShare.is_payer || !newShare.related_user_id) {
        continue
      }
      if (!isFirstOweShare) {
        isFirstOweShare = true
        newShare.amount = newAmountUp
      } else {
        newShare.amount = newAmount
      }
    }
    setTransaction({
      ...transaction,
      shares: newShares
    })
  }

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
      <Header onBack={!isSelected ? closeApp : () => { setIsSelected(false) }} />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">
          {!isSelected ? t('chatBalances') : `${t('settleUpBy')} ${'(curr)'}`}
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
        <Panel>
          <h3>{t('summaryBy')} (curr)</h3>
          <div className="mt-4 flex flex-col gap-3">
            {summary.items.map((summaryItem, i) => (
              <SummaryItem
                key={`SummaryItem-${i}`}
                {...summaryItem}
                onClick={() => { setIsSelected(true) }}
              />
            ))}
          </div>
        </Panel>
      )}

      {!isSelected && summary?.items && summary.items.length === 0 && (
        // todo lottie
        <div>{t('allSettledUp')}</div>
        // todo link
      )}

      {isSelected && (
        <Panel>
          item...
        </Panel>
      )}

      <Button
        isBottom
        text={!isSelected ? t('close') : t('settleUp')}
        onClick={!isSelected ? closeApp : settleUp}
        // disabled={isButtonDisabled}
        isBusy={isBusy}
      />
    </Screen>
  )
}

export default Summary
