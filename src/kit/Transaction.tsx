import cx from 'classnames'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TTransaction } from '../types'

import { Button, CategoryAvatar, Divider } from '../kit'

import { useStore, useUsers, useCurrencies, useFeedback, useTransaction, useUser, useGetChat } from '../hooks'

import { ReactComponent as CashbackIcon } from '../assets/cashback.svg'
import { ReactComponent as ShareIcon } from '../assets/share.svg'
import { ReactComponent as Next } from '../assets/next.svg'

import { formatAmount } from '../utils'

export const Transaction = ({ tx }: { tx: TTransaction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPro, me } = useUser()
  const { data: chat } = useGetChat()

  const { setTxId, setIsEditTx } = useStore()
  const { getUserById } = useUsers()
  const { getCurrencyById } = useCurrencies()
  const { feedback } = useFeedback()

  const { getMyBalanceDelta, getUserBalanceDelta } = useTransaction()
  const myBalanceDelta = getMyBalanceDelta(tx)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  const payeeUserId = useMemo(() => {
    if (!me || !chat?.pay_for) return null
    const payeeIdsRaw = (chat.pay_for as unknown as Record<string, unknown>)[String(me._id)]
    if (!Array.isArray(payeeIdsRaw)) return null
    const normalized = payeeIdsRaw
      .map(v => (typeof v === 'number' ? v : Number.parseInt(String(v), 10)))
      .filter(v => Number.isFinite(v)) as number[]
    return normalized[0] ?? null
  }, [chat?.pay_for, me])

  const payee = payeeUserId ? getUserById(payeeUserId) : undefined
  const payeeDisplayName = payee
    ? (payee.shortened_name || [payee.first_name, payee.last_name].filter(Boolean).join(' '))
    : null

  const isTxConfirmedAndActive = !!tx.is_confirmed && !tx.is_canceled
  const hasMyParticipation = !!me?._id && tx.shares.some(s => s.related_user_id === me._id)
  const hasPayeeParticipation = !!payeeUserId && tx.shares.some(s => s.related_user_id === payeeUserId)

  const payeeBalanceDelta = payeeUserId ? getUserBalanceDelta(tx, payeeUserId) : 0

  // current behavior for payer: show only if non-zero
  const isShowMyBalance = isTxConfirmedAndActive && hasMyParticipation && myBalanceDelta !== 0
  // payee: always show signed delta when payee participates
  const isShowPayeeBalance = isTxConfirmedAndActive && hasPayeeParticipation && !!payeeDisplayName

  const creator = !tx.creator_user_id ? null : getUserById(tx.creator_user_id) || null
  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

  const currency = getCurrencyById(tx.currency_id)
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0)
  const cashbackAmount = tx.cashback ? payerSharesAmount * tx.cashback : null

  const numberOfUsers: number = [...new Set(
    tx.shares
      .filter(share => share.related_user_id && share.amount)
      .map(share => share.related_user_id)
  )].length

  return (
    <Button
      wrapperClassName="Transaction"
      className="w-full flex gap-2 rounded-[16px] text-left bg-bg2 p-2 touchscreen:enabled:hover:brightness-100 touchscreen:enabled:active:brightness-100"
      onClick={() => {
        setTxId(tx._id)
        setIsEditTx(true)
        navigate('/')
        feedback('edit_transaction_total_web', {
          transaction_id: tx._id
        })
      }}
    >
      <>
        {isPro &&
          <CategoryAvatar
            className={cx(tx.is_canceled && 'opacity-50')}
            tx={tx}
            isCategoryName={false}
          />
        }
        <div className="flex-1 flex flex-col gap-[2px] text-[14px] leading-[24px]">
          <div className={cx(tx.is_canceled && 'opacity-50')}>
            <div className="flex gap-2 items-start justify-between">
              <div className="flex-1 first-letter:uppercase line-clamp-1 font-semibold">
                {tx.is_settleup ? t('transactionSettleUp') : (tx.nutshell || t('transaction'))}
              </div>
              <div className="flex flex-center gap-1 h-6 p-1 pr-[6px] rounded-[16px] bg-separator text-textSec2">
                <ShareIcon className="w-4 h-4" />
                <div className="text-[12px] leading-[16px] font-semibold">{numberOfUsers}</div>
              </div>
              {!!false && !!cashbackAmount && (
                <div className="flex gap-[2px] items-center rounded-[8px] px-1 py-[2px] bg-[#FFFEEB] text-[12px] leading-[16px] font-semibold dark:text-[#1A2024]">
                  <CashbackIcon className="w-4 h-4" />
                  <span>{formatAmount(cashbackAmount)}{currency?.symbol}</span>
                </div>
              )}
            </div>
            {payerShares.map(payerShare => {
              const userId = payerShare.related_user_id
              const user = userId ? getUserById(userId) : undefined
              const isPayee = !!userId && userId === payeeUserId

              const title = user
                ? (
                  isPayee && user.shortened_name
                    ? user.shortened_name
                    : [user.first_name, user.last_name].filter(Boolean).join(' ')
                )
                : (payerShare.normalized_name || '???')

              return (
                <div
                  key={`payer-share-${payerShare.person_id}-${String(payerShare.related_user_id)}-${payerShare.amount}`}
                  className="flex gap-2 items-center justify-between text-textSec"
                >
                  <span className="truncate">{title}</span>
                  <span className="font-semibold">{formatAmount(payerShare.amount)}{currency?.symbol}</span>
                </div>
              )
            })}
            {isShowMyBalance && (
            <div className={cx(
              'flex gap-2 items-center justify-between rounded-[4px] bg-[#8881] font-semibold',
              myBalanceDelta > 0 && 'text-green',
              myBalanceDelta < 0 && 'text-red',
            )}>
              <span>{t('myBalance')}</span>
              <span>{myBalanceDelta < 0 ? '−' : '+'} {formatAmount(Math.abs(myBalanceDelta))}{currency?.symbol}</span>
            </div>
            )}
            {isShowPayeeBalance && (
            <div className={cx(
              'flex gap-2 items-center justify-between rounded-[4px] bg-[#8881] font-semibold text-blue',
            )}>
              <span className="truncate">{payeeDisplayName}</span>
              <span>{payeeBalanceDelta < 0 ? '−' : '+'} {formatAmount(Math.abs(payeeBalanceDelta))}{currency?.symbol}</span>
            </div>
            )}
          </div>
          <Divider className="!mx-0 !my-[6px]" />
          <div className="flex justify-between gap-2">
            <div className="flex flex-wrap gap-x-2 gap-y-1 pt-[2px] --empty:hidden">
              {[
                ...((!tx.is_confirmed && !tx.is_canceled) ? [{
                  color: '#D29404',
                  text: t('statusUnconfirmed'),
                }] : []),
                ...(tx.is_canceled ? [{
                  color: '#CC0905',
                  text: t('statusCanceled'),
                }] : []),
                ...(/*[] ||*/ (editor // disabled
                  ? [{
                      text: `${t('statusEditedBy')} ${
                        (editor.shortened_name
                          ? [editor.shortened_name]
                          : [editor.first_name, editor.last_name]
                        ).filter(_ => _).join(' ')
                      }`,
                    }]
                  : creator
                    ? [{
                        text: `${t('statusCreatedBy')} ${
                          (creator.shortened_name
                            ? [creator.shortened_name]
                            : [creator.first_name, creator.last_name]
                          ).filter(_ => _).join(' ')
                        }`,
                      }]
                    : [])),
              ].map(tag => (
                <div
                  key={tag.text}
                  className="rounded-[8px] px-1 py-[2px] bg-separator text-[12px] leading-[16px] font-semibold"
                  style={{ color: tag.color }}
                >
                  {tag.text}
                </div>
              ))}
            </div>
            <Next className="w-6 h-6 text-icon" />
          </div>
        </div>
      </>
    </Button>
  )
}
