import { useQueryClient } from '@tanstack/react-query'
import { useHapticFeedback, useShowPopup } from '@vkruglikov/react-telegram-web-app'

import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import UserAmount from '../kit/UserAmount'
import Overlay from '../kit/Overlay'
import Panel from '../kit/Panel'
import MessagePanel from '../kit/MessagePanel'
import Screen from '../kit/Screen'
import Toggle from '../kit/Toggle'

import Divider from '../kit/Divider'
import UserRelation from '../kit/UserRelation'

import { useGetTx, useGetTransactions, useGetSummary } from '../api'

import { decimals } from '../const'
import { useCurrencies, useInit, useChatId, useFeedback, useTransaction, useUsers } from '../hooks'
import { useStore } from '../store'
import { usePostTransaction, usePutTransaction } from '../api'

import type { TNewTransaction, TShare, TTransaction, TLanguageCode } from '../types'
import { closeApp } from '../utils'

import lottieSuccess from '../assets/animation-success.json'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import { ReactComponent as DeleteIcon } from '../assets/delete.svg'
import { ReactComponent as Plus } from '../assets/plus.svg'

function Check() {
  useInit()

  const [impactOccurred, notificationOccurred] = useHapticFeedback()
  const showPopup = useShowPopup()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const { setTransaction, txComment, isEditTx, setIsEditTx, setSelectPersonId, setIsSelectPayers, isSuccess, setSuccess, setTxPatchError } = useStore()
  const { transaction, isWrongAmounts, payedShares, oweShares, payedSum, payedSumFormatted, oweSumFormatted, deduplicatedShares } = useTransaction()
  const { unrelatedUsers, countUnrelatedPersons, isRelationsComplete, isRelationsEnough } = useUsers()

  const { getCurrencyById } = useCurrencies()

  const postTransaction = usePostTransaction()
  const putTransaction = usePutTransaction()

  const { chatId } = useChatId()
  const queryClient = useQueryClient()
  const { refetch: refetchTransaction } = useGetTx()
  const { refetch: refetchTransactions } = useGetTransactions(chatId)
  const { refetch: refetchSummary } = useGetSummary()

  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    if (transaction) {
      setTransaction(rebalanceEquallyTx(transaction))
    }
  }, [transaction, setTransaction])

  if (!transaction) {
    return null
  }

  const currency = getCurrencyById(transaction.currency_id)
  const isNoCurrency = !transaction.currency_id

  const isButtonDisabled = isWrongAmounts || isNoCurrency || !isRelationsComplete || !isRelationsEnough
  const buttonText =
    isNoCurrency ? `🐨 ${t('selectCurrency')}` :
    isWrongAmounts ? `🐨 ${t('checkAmounts')}` :
    !isRelationsComplete ? `🐨 ${t('pleaseMatchUsers')} (${countUnrelatedPersons})` :
    !isRelationsEnough ? `🐨 ${t('pleaseAddUsers')}` :
    t('save')


  const onSelect = (personId: string | null) => {
    if (personId === null) {
      return
    }
    setSelectPersonId(personId)
    console.log('onSelect vibro')
    impactOccurred('light')
    navigate('/select-user')
  }

  const onAdd = () => {
    setSelectPersonId(null)
    console.log('onAdd vibro')
    impactOccurred('light')
    navigate('/select-user')
    feedback('press_add_user_expnames_web', {
      num_users_prev: deduplicatedShares.length
    })
  }

  const toggleIsEqually = () => {
    const updIsEqually = !transaction.is_equally
    if (updIsEqually) {
      feedback('set_equal_share_expshares_web')
    } else {
      feedback('unset_equal_share_expshares_web')
    }
    setTransaction({
      ...transaction,
      is_equally: updIsEqually,
      shares: updIsEqually ? transaction.shares : transaction.shares.map(share => ({
        ...share,
        is_fixed_amount: false
      }))
    })
  }

  const changeAmount = (share: TShare, amount: number) => {
    const shareIndex = transaction.shares.findIndex(s =>
      s.person_id === share.person_id
      && s.related_user_id === share.related_user_id
      && s.is_payer === share.is_payer
    )
    if (~shareIndex) {
      const updShares = [...transaction.shares]
      updShares[shareIndex].amount = amount
      if (transaction.is_equally && !share.is_payer) {
        share.is_fixed_amount = true
      }
      const updTx = {
        ...transaction,
        shares: updShares
      }
      setTransaction(rebalanceEquallyTx(updTx))
    }
  }

  const rebalanceEquallyTx: (tx: TTransaction | TNewTransaction) => TTransaction | TNewTransaction = (tx) => {
    if (!tx.is_equally) {
      return tx
    }
    const oweSharesFixed = oweShares.filter(share => share.is_fixed_amount)
    const oweSharesFixedSum = oweSharesFixed.reduce((acc, share) => acc + share.amount, 0)
    const divisibleSum = Math.max(0, payedSum - oweSharesFixedSum)
    const oweSharesUnfixed = oweShares.filter(share => !share.is_fixed_amount)

    const newAmount = parseFloat(
      (
        Math.floor((10**decimals * divisibleSum / oweSharesUnfixed.length)) / 10**decimals
      ).toFixed(decimals)
    )
    const newAmountUp = divisibleSum - (oweSharesUnfixed.length - 1) * newAmount

    const newShares = [...tx.shares]
    let isFirstOweShare = false
    for (let newShare of newShares) {
      if (newShare.is_payer || !newShare.related_user_id || newShare.is_fixed_amount) {
        continue
      }
      if (!isFirstOweShare) {
        isFirstOweShare = true
        newShare.amount = newAmountUp
      } else {
        newShare.amount = newAmount
      }
    }
    if (JSON.stringify(newShares) === JSON.stringify(tx.shares)) {
      return tx
    }
    return {
      ...tx,
      shares: newShares
    }
  }

  const save = async ({ isCanceled = false } = {}) => {
    setIsBusy(true)
    try {
      const newConfirmedTransaction: TNewTransaction = {
        ...transaction as TNewTransaction,
        ...(txComment ? { raw_text: txComment } : {}),
      }
      const confirmedTransaction: TTransaction = {
        ...transaction as TTransaction,
        ...(txComment ? { raw_text: txComment } : {}),
        is_canceled: !!isCanceled,
        is_confirmed: true
      }
      await feedback('send_transaction_web')
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
          refetchTransaction()
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

  const cancel = async () => {
    const title = t('cancelTransaction')
    const message = t('sureToCancelTransaction')
    let answerButtonId: string
    try {
      feedback('press_cancel_transaction_expshares_web')
      answerButtonId = await showPopup({
        title,
        message,
        buttons: [
          {
            id: 'delete',
            text: t('delete'),
            type: 'destructive',
          },
          {
            id: 'cancel',
            text: t('cancel'),
            type: 'default',
          },
        ],
      })
    } catch {
      answerButtonId = confirm(message) ? 'delete' : 'cancel'
    }

    if (answerButtonId === 'delete') {
      save({ isCanceled: true })
      feedback('confirm_cancel_transaction_expshares_web')
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
            closeApp()
          }
        }} />

        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">{t('checkout')}</h2>
          <Button
            theme="text"
            text={currency ? `${currency.flag} ${currency.title[i18n.language as TLanguageCode]}` : t('selectCurrency')}
            onClick={() => {
              navigate('/select-currency')
              feedback('change_currency_expshares_web', {
                currency_prev: currency?._id || null
              })
            }}
          />
        </div>

        <MessagePanel />

        <Panel>
          <div>
            <div className="mt-2">
              {!!deduplicatedShares.length && (
                <div className="-mx-4 overflow-y-auto">
                  {deduplicatedShares.map((share, i) => (
                    <div key={`UserRelation-Divider-${i}`}>
                      <UserRelation
                        key={`UserRelation-${i}`}
                        {...share}
                        onClick={() => {
                          feedback('press_change_user_expnames_web', {
                            user_prev: share.related_user_id || null
                          })
                          onSelect(share.person_id)
                        }}
                      />
                      {i < deduplicatedShares.length - 1 && <Divider key={`Divider-${i}`} />}
                    </div>
                  ))}
                </div>
              )}
              {!deduplicatedShares.length && (
                <span className="opacity-40">{t('nobodyHere')}</span>
              )}
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h3>{t('whoPaid')} <span>{payedSumFormatted}{currency?.symbol}</span></h3>
            <Button
              theme="icon"
              text={<EditIcon />}
              onClick={() => {
                setIsSelectPayers(true)
                navigate('/select-users')
                feedback('edit_payers_expshares_web', {
                  num_payers_prev: payedShares.length
                })
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

        {false && !!unrelatedUsers.length && (
          <Button
            theme="clear"
            className="px-2 text-button h-6 items-center flex gap-[2px] font-semibold text-[14px] leading-6 hover:brightness-[1.2] active:brightness-[1.4] transition-all"
            text={
              <>
                <Plus className="h-6 w-6 flex items-center justify-center" />
                <span className="whitespace-nowrap">{t('addMore')}</span>
              </>
            }
            onClick={onAdd}
          />
        )}

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h3>{t('forWhom')} <span>{oweSumFormatted}{currency?.symbol}</span></h3>
            <Button
              theme="icon"
              text={<EditIcon />}
              onClick={() => {
                setIsSelectPayers(false)
                navigate('/select-users')
                feedback('edit_debtors_expshares_web', {
                  num_debtors_prev: oweShares.length
                })
              }}
            />
          </div>
          <div className="min-h-[24px] mt-[2px]">
            <Toggle
              label={t('splitEqually')}
              value={!!transaction.is_equally}
              onChange={toggleIsEqually}
            />
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

        {!transaction.is_canceled && transaction._id !== 'NEW' && (
          <div className="m-4">
            <Button
              theme="clear"
              className="w-full border border-[#DDE2E4] dark:border-[#6E7C87] rounded-[6px]"
              text={
                <div className="min-h-[40px] flex items-center justify-center gap-2 text-[14px] leading-[24px]">
                  <DeleteIcon />
                  <span>{t('cancelTransaction')}</span>
                </div>
              }
              onClick={cancel}
              isBusy={isBusy}
            />
          </div>
        )}

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
