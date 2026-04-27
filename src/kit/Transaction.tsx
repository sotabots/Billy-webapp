import cx from 'classnames'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TTransaction } from '../types'

import { Button, CategoryAvatar, Divider } from '../kit'

import { useStore, useUsers, useCurrencies, useFeedback, useTransaction, useUser, useGetChat } from '../hooks'

import { ReactComponent as ShareIcon } from '../assets/share.svg'

import { formatAmount, getTransactionEditPath } from '../utils'

const formatTxDateTime = (timeCreated: string, language: string) => {
  const date = new Date(timeCreated)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const txDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const dayDiff = Math.round((today - txDay) / (24 * 60 * 60 * 1000))
  const time = date.toLocaleTimeString(language, {
    hour: 'numeric',
    minute: '2-digit'
  })

  if (dayDiff === 0) {
    return `${time}, ${language === 'ru' ? 'сегодня' : 'today'}`
  }

  if (dayDiff === 1) {
    return `${time}, ${language === 'ru' ? 'вчера' : 'yesterday'}`
  }

  const isCurrentYear = now.getFullYear() === date.getFullYear()
  const day = date.toLocaleDateString(language, {
    day: 'numeric',
    month: 'short',
    ...(isCurrentYear ? {} : { year: 'numeric' })
  })

  return `${time}, ${day}`
}

const DESCRIPTION_MAX_LENGTH = 42

const shortenDescription = (description: string) => {
  const normalizedDescription = description.replace(/\s+/g, ' ').trim()

  if (normalizedDescription.length <= DESCRIPTION_MAX_LENGTH) {
    return normalizedDescription
  }

  return `${normalizedDescription.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}...`
}

export const Transaction = ({ tx, showPendingBalance = false }: {
  tx: TTransaction
  showPendingBalance?: boolean
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { me } = useUser()
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
  const canShowBalanceDelta = isTxConfirmedAndActive || (!!showPendingBalance && !tx.is_canceled)
  const isShowMyBalance = canShowBalanceDelta && hasMyParticipation && myBalanceDelta !== 0
  // payee: always show signed delta when payee participates
  const isShowPayeeBalance = canShowBalanceDelta && hasPayeeParticipation && !!payeeDisplayName

  const creator = !tx.creator_user_id ? null : getUserById(tx.creator_user_id) || null
  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

  const currency = getCurrencyById(tx.currency_id)
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0)

  const numberOfUsers: number = [...new Set(
    tx.shares
      .filter(share => share.related_user_id && share.amount)
      .map(share => share.related_user_id)
  )].length

  const title = tx.is_settleup ? t('transactionSettleUp') : (tx.nutshell || t('transaction'))
  const shortenedTitle = shortenDescription(title)
  const primaryPayerShare = payerShares[0]
  const primaryPayerUser = primaryPayerShare?.related_user_id ? getUserById(primaryPayerShare.related_user_id) : undefined
  const primaryPayerName = primaryPayerUser
    ? (primaryPayerUser.shortened_name || [primaryPayerUser.first_name, primaryPayerUser.last_name].filter(Boolean).join(' '))
    : (primaryPayerShare?.normalized_name || '???')

  const oweShares = tx.shares.filter(share => !share.is_payer)
  const primaryOweShare = oweShares[0]
  const primaryOweUser = primaryOweShare?.related_user_id ? getUserById(primaryOweShare.related_user_id) : undefined
  const primaryOweName = primaryOweUser
    ? (primaryOweUser.shortened_name || [primaryOweUser.first_name, primaryOweUser.last_name].filter(Boolean).join(' '))
    : (primaryOweShare?.normalized_name || '???')

  const isShowOwnDelta = isShowMyBalance || isShowPayeeBalance
  const ownDelta = isShowPayeeBalance ? payeeBalanceDelta : myBalanceDelta
  const ownDeltaLabel = isShowPayeeBalance
    ? payeeDisplayName
    : (ownDelta > 0 ? t('owedToMe') : t('myBalance'))

  return (
    <Button
      wrapperClassName="Transaction"
      className="w-full flex gap-2 rounded-[16px] text-left bg-bg2 p-2 touchscreen:enabled:hover:brightness-100 touchscreen:enabled:active:brightness-100"
      onClick={() => {
        setTxId(tx._id)
        setIsEditTx(true)
        navigate(getTransactionEditPath(tx._id))
        feedback('edit_transaction_total_web', {
          transaction_id: tx._id
        })
      }}
    >
      <>
        <CategoryAvatar
          className={cx(tx.is_canceled && 'opacity-50')}
          tx={tx}
          isCategoryName={false}
        />
        <div className="flex-1 flex flex-col gap-[2px] text-[14px] leading-[24px]">
          <div className={cx(tx.is_canceled && 'opacity-50')}>
            <div className="flex gap-2 items-start justify-between">
              <div
                className="flex-1 min-w-0 first-letter:uppercase truncate font-semibold text-text"
                title={title}
              >
                {shortenedTitle}
              </div>
              {!!numberOfUsers && (
              <div className="flex items-center gap-1 h-6 pl-1 pr-[6px] rounded-[16px] bg-separator text-textSec2">
                <ShareIcon className="w-4 h-4" />
                <div className="text-[12px] leading-[16px] font-semibold">{numberOfUsers}</div>
              </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 text-textSec">
              <span className="truncate">{formatTxDateTime(tx.time_created, i18n.language)}</span>
            </div>
            <Divider className="!mx-0 !my-[4px]" />
            <div className="flex flex-col leading-[24px]">
              {tx.is_settleup ? (
                <div
                  className="flex gap-2 items-center justify-between text-textSec"
                >
                  <span className="flex-1 min-w-0 truncate">
                    {primaryPayerName}
                    <span className="px-1 text-textSec2">→</span>
                    {primaryOweName}
                  </span>
                  <span className="font-semibold">{formatAmount(payerSharesAmount)}{currency?.symbol}</span>
                </div>
              ) : payerShares.map(payerShare => {
                const userId = payerShare.related_user_id
                const user = userId ? getUserById(userId) : undefined
                const isPayee = !!userId && userId === payeeUserId

                const payerTitle = user
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
                    <span className="truncate">{t('paidBy', { name: payerTitle })}</span>
                    <span className="font-semibold">{formatAmount(payerShare.amount)}{currency?.symbol}</span>
                  </div>
                )
              })}
              {isShowOwnDelta && (
              <div className={cx(
                'flex gap-2 items-center justify-between rounded-[4px] font-semibold',
                ownDelta > 0 && 'text-green',
                ownDelta < 0 && 'text-red',
                isShowPayeeBalance && 'text-blue',
              )}>
                <span className="truncate text-textSec">{ownDeltaLabel}</span>
                <span>{formatAmount(Math.abs(ownDelta))}{currency?.symbol}</span>
              </div>
              )}
            </div>
          </div>
          {(!tx.is_confirmed || tx.is_canceled || !!creator || !!editor) && (
          <div className="flex justify-between gap-2 pt-1">
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
          </div>
          )}
        </div>
      </>
    </Button>
  )
}
