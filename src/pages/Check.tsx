import { useQueryClient } from '@tanstack/react-query'
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import Lottie from 'lottie-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import UserAmount from '../kit/UserAmount'
import Overlay from '../kit/Overlay'
import Panel from '../kit/Panel'
import MessagePanel from '../kit/MessagePanel'
import Screen from '../kit/Screen'

import { useGetTransactions, useGetSummary } from '../api'

import { decimals } from '../const'
import { useCurrencies, useInit, useChatId } from '../hooks'
import { useStore } from '../store'
import { feedback, EVENT } from '../feedback'
import { usePostTransaction, usePutTransaction } from '../api'
import { formatAmount } from '../utils'
import type { TNewTransaction, TShare, TTransaction } from '../types'

import lottieSuccess from '../assets/animation-success.json'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import { ReactComponent as SplitIcon } from '../assets/split.svg'

function Check() {
  useInit()

  const [, notificationOccurred] = useHapticFeedback()

  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isBusy, setIsBusy] = useState(false)
  const { transaction, setTransaction, txComment, isEditTx, setIsEditTx, setIsSelectPayers, isSuccess, setSuccess, setTxPatchError } = useStore()

  const { getCurrencyById } = useCurrencies()

  const postTransaction = usePostTransaction()
  const putTransaction = usePutTransaction()

  const { chatId } = useChatId()
  const queryClient = useQueryClient()
  const { refetch: refetchTransactions } = useGetTransactions(chatId)
  const { refetch: refetchSummary } = useGetSummary()

  if (!transaction) {
    return null
  }

  const currency = getCurrencyById(transaction.currency_id)

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

  const isWrongAmounts = !isBalanced || !(payedSum > 0) || !(oweSum > 0)
  const isNoCurrency = !transaction.currency_id
  const isButtonDisabled = isWrongAmounts || isNoCurrency
  const buttonText =
    isNoCurrency ? `🐨 ${t('selectCurrency')}` :
    isWrongAmounts ? `🐨 ${t('checkAmounts')}` :
    t('save')

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
    setIsBusy(true)
    try {
      const newConfirmedTransaction: TNewTransaction = {
        ...transaction as TNewTransaction,
        ...(txComment ? { raw_text: txComment } : {}),
      }
      const confirmedTransaction: TTransaction = {
        ...transaction as TTransaction,
        ...(txComment ? { raw_text: txComment } : {}),
        is_confirmed: true
      }
      await feedback(EVENT.SEND_TRANSACTION)
      // console.log(JSON.stringify(confirmedTransaction, null, 2))
      const resJson = transaction._id === 'NEW'
        ? await postTransaction(newConfirmedTransaction)
        : await putTransaction(confirmedTransaction)
      console.log('patch res json', resJson)
      setSuccess(true)
      console.log('success vibro')
      notificationOccurred('success')
      setTimeout(() => {
        if (isEditTx) {
          // todo: remove?
          queryClient.invalidateQueries({ queryKey: [
            `tx-${transaction._id}`,
            'transactions'
          ] })
          refetchTransactions()
          refetchSummary()

          navigate('/summary')
          setSuccess(false)
        } else {
          window.Telegram?.WebApp.close()
        }
      }, 2300)
    } catch (e) {
      console.log('err', e)
      setSuccess(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <>
      <Screen>
        <Header onBack={() => {
          if (isEditTx) {
            history.back()
            setIsEditTx(false)
          } else {
            navigate('/')
          }
        }} />

        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">{t('checkout')}</h2>
          <Button
            theme="text"
            text={currency ? currency.in : t('selectCurrency')}
            onClick={() => { navigate('/select-currency') }}
          />
        </div>

        <MessagePanel />

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h3>{t('whoPaid')} <span>{payedSumFormatted}{currency?.symbol}</span></h3>
            <Button
              theme="icon"
              text={<EditIcon />}
              onClick={() => {
                setIsSelectPayers(true)
                navigate('/select-users')
              }}
            />
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {!payedShares.length && <span className="opacity-40">{t('nobodyHere')}</span>}
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
          <div className="flex items-center justify-between gap-3">
            <h3>{t('forWhom')} <span>{oweSumFormatted}{currency?.symbol}</span></h3>
            <Button
              theme="icon"
              text={<EditIcon />}
              onClick={() => {
                setIsSelectPayers(false)
                navigate('/select-users')
              }}
            />
          </div>
          <div className="h-[24px] mt-[2px]">
            {!!oweShares.length && (!isSplitedEqually || !isBalanced) && (
              <Button
                theme="text"
                text={(
                  <div className="inline-flex items-center gap-[2px]">
                    <div className="w-6 h-6">
                      <SplitIcon />
                    </div>
                    <div>{t('splitEqually')}</div>
                  </div>
                )}
                onClick={splitEqually}
              />
            )}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {!oweShares.length && <span className="opacity-40">{t('nobodyHere')}</span>}
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
          text={buttonText}
          onClick={save}
          disabled={isButtonDisabled}
          isBusy={isBusy}
        />
      </Screen>

      <Overlay isOpen={!!isSuccess} isCenter>
        <div className="w-[200px] h-[200px] p-4 text-center text-button text-[24px] font-medium">
          {!!isSuccess && (
            <Lottie animationData={lottieSuccess} loop={true} />
          )}
        </div>
      </Overlay>
    </>
  )
}

export default Check
