import cx from 'classnames'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import UserAmount from '../kit/UserAmount'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'

import { TOLERANCE, decimals } from '../const'
import { useInit } from '../hooks'
import { useStore } from '../store'
import { feedback, EVENT } from '../feedback'
import { usePatchTransaction } from '../api'
import { formatAmount } from '../utils'
import type { TShare } from '../types'

function Check() {
  useInit()
  const navigate = useNavigate()
  const [isBusy, setIsBusy] = useState(false)
  const { currencies, transaction, setTransaction, setSuccess, setTxPatchError } = useStore()

  const patchTransaction = usePatchTransaction()

  if (!transaction) {
    return null
  }

  const currency = currencies.find(currency => currency.id === transaction.currency_id)

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

  const payedSum = transaction.shares.filter(item => item.is_payer).reduce((acc, item) => acc + item.amount, 0)
  const payedSumFormatted = formatAmount(payedSum)
  const oweSum = transaction.shares.filter(item => !item.is_payer).reduce((acc, item) => acc + item.amount, 0)
  const oweSumFormatted = formatAmount(oweSum)

  const isLacks = payedSum < oweSum - TOLERANCE
  const isBalanced = Math.abs(payedSum - oweSum) <= TOLERANCE
  const isOverdo = payedSum > oweSum + TOLERANCE

  const isButtonDisabled = !isBalanced || !(payedSum > 0) || !(oweSum > 0)

  const payedShares = transaction.shares.filter(share => share.related_user_id && share.is_payer)
  const oweShares = transaction.shares.filter(share => share.related_user_id && !share.is_payer)

  const payerIds = payedShares.map(share => share.related_user_id!)
  const oweIds = oweShares.map(share => share.related_user_id!)
  const isSelfPayers = payerIds.some(payerId => oweIds.includes(payerId))

  const isEquallyOwe = oweShares.every(share => share.amount === oweShares[0].amount)

  const setEqually = () => {
    const newAmount = parseFloat((payedSum / oweShares.length).toFixed(decimals))
    const newShares = [...transaction.shares]
    setTransaction({
      ...transaction,
      shares: newShares.map(share => share.is_payer ? share : ({
        ...share,
        amount: newAmount
      }))
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window?.Telegram?.WebApp?.close()
      }, 2300)
    } catch (e) {
      setSuccess(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Screen>
      <Header onBack={() => { navigate('/') }} />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
        <Button
          theme="text"
          text={currency ? currency.in : 'Выберите валюту'}
          onClick={() => { navigate('/select-currency') }}
        />
      </div>

      <Panel className="!pb-4">
        <h3 className={cx(!isBalanced && 'text-error')}>
          {isLacks && 'Не хватает'}
          {isBalanced && 'Всё верно'}
          {isOverdo && 'Перебор'}
        </h3>
        <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили {payedSumFormatted} {currency?.symbol}, должны {oweSumFormatted} {currency?.symbol}</div>
      </Panel>

      <Panel>
        <h3>Заплатили</h3>
        <div className="mt-4 flex flex-col gap-3">
          {!payedShares.length && <span className="opacity-40">(Пусто)</span>}
          {payedShares.map((share, shareIndex) => (
            <UserAmount
              key={`payer-share-${shareIndex}`}
              {...share}
              onChange={(value) => {
                changeAmount(share, value)
              }}
            />
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between">
          <h3>За {isSelfPayers && <span>себя и за</span>} других</h3>
          {!!oweShares.length && (!isEquallyOwe || !isBalanced) && (
            <Button
              theme="text"
              text="Поровну"
              onClick={setEqually}
            />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {!oweShares.length && <span className="opacity-40">(Пусто)</span>}
          {oweShares.map((share, shareIndex) => (
            <UserAmount
              key={`owe-share-${shareIndex}`}
              {...share}
              onChange={(value) => {
                changeAmount(share, value)
              }}
            />
          ))}
        </div>
      </Panel>

      <Button
        isBottom
        text="Сохранить"
        onClick={save}
        disabled={isButtonDisabled}
        isBusy={isBusy}
      />
    </Screen>
  )
}

export default Check
