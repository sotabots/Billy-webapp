import { useQueryClient } from '@tanstack/react-query'
import { useHapticFeedback, useShowPopup } from '@vkruglikov/react-telegram-web-app'

import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { decimals } from '../const'
import { useStore, useCurrencies, useInit, useFeedback, useTransaction, useUsers, useUser, useGetTx, useGetTransactions, useGetSummary, usePostTransaction, usePutTransaction, useGetProfile } from '../hooks'
import { Button, Header, UserAmount, Overlay, Panel, MessagePanel, Page, Toggle } from '../kit'
import type { TNewTransaction, TShare, TTransaction, TLanguageCode } from '../types'

import lottieSuccess from '../assets/animation-success.json'
import { ReactComponent as AddIcon } from '../assets/add.svg'
import { ReactComponent as DeleteIcon } from '../assets/delete.svg'

export const Edit = () => {
  useInit()

  const [impactOccurred, notificationOccurred] = useHapticFeedback()
  const showPopup = useShowPopup()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const { setTransaction, txComment, isEditTx, setIsEditTx, setSelectPersonId, setSelectPersonIsPayer, setIsSelectPayers, isSuccess, setSuccess, setTxPatchError, setPaywallSource, setPaywallFrom } = useStore()
  const { transaction, isWrongAmounts, payedShares, oweShares, payedSum, payedSumFormatted, oweSumFormatted } = useTransaction()
  const { countUnrelatedPersons, isRelationsComplete, isRelationsEnough } = useUsers()

  const { getCurrencyById } = useCurrencies()

  const postTransaction = usePostTransaction()
  const putTransaction = usePutTransaction()

  const queryClient = useQueryClient()
  const { refetch: refetchTransaction } = useGetTx()
  const { refetch: refetchTransactions } = useGetTransactions()
  const { refetch: refetchSummary } = useGetSummary()
  const { refetch: refetchProfile } = useGetProfile()

  const { isPro } = useUser()

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

  const isGoPaywall = transaction?.is_allowed_to_confirm === false && !isPro

  const isButtonDisabled = !isRelationsComplete || !isRelationsEnough || isNoCurrency || isWrongAmounts
  const buttonText =
    !isRelationsComplete ? `🐨 ${t('pleaseMatchUsers')} (${countUnrelatedPersons})` :
    !isRelationsEnough ? `🐨 ${t('pleaseAddUsers')}` :
    isNoCurrency ? `🐨 ${t('selectCurrency')}` :
    isWrongAmounts ? `🐨 ${t('checkAmounts')}` :
    isGoPaywall ? `🐨 ${t('buyProForSave')}` :
    t('save')

  const onSelect = (personId: string | null, isPayer: boolean) => {
    if (personId === null) {
      return
    }
    setSelectPersonId(personId)
    setSelectPersonIsPayer(isPayer)
    console.log('onSelect vibro')
    impactOccurred('light')
    navigate('/select-user')
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
    for (const newShare of newShares) {
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
        ...(txComment ? {
          raw_text: txComment,
          nutshell: txComment,
        } : {}),
      }
      const confirmedTransaction: TTransaction = {
        ...transaction as TTransaction,
        ...(txComment ? { raw_text: txComment } : {}),
        is_canceled: !!isCanceled,
        is_confirmed: true
      }
      await feedback('send_transaction_web', {
        is_voice: transaction.is_voice,
        is_edited: transaction._id === 'NEW' ? false : transaction.is_confirmed,
        is_settleup: transaction.is_settleup,
        is_personal: transaction.is_personal,
      })
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
          setTransaction(undefined)
          refetchTransaction()
          refetchTransactions()
          refetchSummary()
          refetchProfile()

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

  const goPaywall = () => {
    setPaywallSource('voice_limit')
    setPaywallFrom('edit')
    navigate('/paywall')
  }

  return (
    <>
      <Page>
        <Header onBack={
          isEditTx
            ? () => {
              history.back()
              setIsEditTx(false)
            }
            : undefined
        } />

        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">{t('checkout')}</h2>
          <Button
            theme="text"
            onClick={() => {
              navigate('/select-currency')
              feedback('change_currency_expshares_web', {
                currency_prev: currency?._id || null
              })
            }}
          >
            {currency ? `${currency.flag} ${currency.title[i18n.language as TLanguageCode]}` : t('selectCurrency')}
          </Button>
        </div>

        <MessagePanel />

        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h3>{t('whoPaid')} <span>{payedSumFormatted}{currency?.symbol}</span></h3>
            <Button
              className="flex items-center justify-center gap-[2px] px-2 text-blue"
              onClick={() => {
                setIsSelectPayers(true)
                navigate('/select-users')
                feedback('edit_payers_expshares_web', {
                  num_payers_prev: payedShares.length
                })
              }}
            >
              <>
                <AddIcon className="w-6 h-6" />
                <div className="text-[14px] leading-[24px] font-semibold">
                  {t('add')}
                </div>
              </>
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {!payedShares.length && <span className="opacity-40">{t('nobodyHere')}</span>}
            {payedShares.map((share, shareIndex) => (
              <UserAmount
                key={`payer-share-${shareIndex}`}
                share={share}
                onClick={() => {
                  feedback('press_change_user_expnames_web', {
                    user_prev: share.related_user_id || null
                  })
                  onSelect(share.person_id, true)
                }}
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
              className="flex items-center justify-center gap-[2px] px-2 text-blue"
              onClick={() => {
                setIsSelectPayers(false)
                navigate('/select-users')
                feedback('edit_debtors_expshares_web', {
                  num_debtors_prev: oweShares.length
                })
              }}
            >
              <>
                <AddIcon className="w-6 h-6" />
                <div className="text-[14px] leading-[24px] font-semibold">
                  {t('add')}
                </div>
              </>
            </Button>
          </div>
          {oweShares.length > 1 &&
            <div className="min-h-[24px] mt-[2px]">
              <Toggle
                label={t('splitEqually')}
                value={!!transaction.is_equally}
                onChange={toggleIsEqually}
              />
            </div>
          }
          <div className="mt-4 flex flex-col gap-1">
            {!oweShares.length && <span className="opacity-40">{t('nobodyHere')}</span>}
            {oweShares.map((share, shareIndex) => (
              <UserAmount
                key={`owe-share-${shareIndex}`}
                share={share}
                onClick={() => {
                  feedback('press_change_user_expnames_web', {
                    user_prev: share.related_user_id || null
                  })
                  onSelect(share.person_id, false)
                }}
                onChange={(value) => {
                  changeAmount(share, value)
                }}
              />
            ))}
          </div>
        </Panel>

        {!transaction.is_canceled && transaction._id !== 'NEW' && (
          <div className="p-4">
            <Button
              className="w-full border border-[#DDE2E4] dark:border-[#6E7C87] rounded-[6px]"
              onClick={cancel}
              isBusy={isBusy}
            >
              <div className="min-h-[40px] flex items-center justify-center gap-2 text-[14px] leading-[24px]">
                <DeleteIcon />
                <span>{t('cancelTransaction')}</span>
              </div>
            </Button>
          </div>
        )}

        <Button
          theme="bottom"
          onClick={isGoPaywall ? goPaywall : save}
          disabled={isButtonDisabled}
          isBusy={isBusy}
        >
          {buttonText}
        </Button>
      </Page>

      <Overlay isOpen={!!isSuccess} isCenter>
        <div className="w-[200px] h-[200px] p-4 text-center text-blue text-[24px] font-medium">
          {!!isSuccess && (
            <Lottie animationData={lottieSuccess} loop={true} />
          )}
        </div>
      </Overlay>
    </>
  )
}
