import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TTransaction } from '../types'

import { Button, CategoryAvatar } from '../kit'

import { useStore, useUsers, useCurrencies, useFeedback, useTransaction, useUser } from '../hooks'

import { ReactComponent as CashbackIcon } from '../assets/cashback.svg'

import { formatAmount } from '../utils'

export const Transaction = ({ tx }: { tx: TTransaction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPro } = useUser()

  const { setTxId, setIsEditTx } = useStore()
  const { getUserById } = useUsers()
  const { getCurrencyById } = useCurrencies()
  const { feedback } = useFeedback()

  const { getMyBalanceDelta } = useTransaction()
  const myBalanceDelta = getMyBalanceDelta(tx)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  const creator = !tx.creator_user_id ? null : getUserById(tx.creator_user_id) || null
  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

  const currency = getCurrencyById(tx.currency_id)
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0)
  const cashbackAmount = tx.cashback ? payerSharesAmount * tx.cashback : null

  return (
    <Button
      theme="clear"
      wrapperClassName="Transaction"
      className="w-full flex gap-2 text-left"
      onClick={() => {
        setTxId(tx._id)
        setIsEditTx(true)
        navigate('/')
        feedback('edit_transaction_total_web', {
          transaction_id: tx._id
        })
      }}
      text={
        <>
          {isPro &&
            <CategoryAvatar tx={tx} isCategoryName={false} />
          }
          <div className="flex-1 flex flex-col gap-[2px] text-[14px] leading-[24px]">
            {payerShares.map(payerShare => (
              <div className="flex gap-2 items-center justify-between px-2 font-semibold">
                <span>{(() => {
                  const user = getUserById(payerShare.related_user_id || 1)
                  return user
                    ? [user.first_name, user.last_name].join(' ')
                    : '??? ???'
                })()}</span>
                <span>{formatAmount(payerShare.amount)}{currency?.symbol}</span>
              </div>
            ))}
            {!!myBalanceDelta && !(!tx.is_confirmed || tx.is_canceled) && (
            <div className={cx(
              'flex gap-2 items-center justify-between rounded-[4px] px-2 bg-[#8881] font-semibold',
              myBalanceDelta > 0 && 'text-plus',
              myBalanceDelta < 0 && 'text-minus',
            )}>
              <span>{t('myBalance')}</span>
              <span>{myBalanceDelta < 0 ? '−' : '+'} {formatAmount(Math.abs(myBalanceDelta))}{currency?.symbol}</span>
            </div>
            )}
            <div className="flex gap-2 items-start justify-between px-2">
              <div className="flex-1 opacity-60 first-letter:uppercase line-clamp-3">{tx.nutshell}</div>
              {!!cashbackAmount && (
                <div className="flex gap-[2px] items-center rounded-[8px] px-1 py-[2px] bg-[#FFFEEB] text-[12px] leading-[16px] font-semibold dark:text-[#1A2024]">
                  <CashbackIcon className="w-4 h-4" />
                  <span>{formatAmount(cashbackAmount)}{currency?.symbol}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 px-2 pt-[2px] empty:hidden">
              {[
                ...((!tx.is_confirmed && !tx.is_canceled) ? [{
                  color: '#D29404',
                  text: t('statusUnconfirmed'),
                }] : []),
                ...(tx.is_canceled ? [{
                  color: '#CC0905',
                  text: t('statusCanceled'),
                }] : []),
                ...(editor
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
                    : []),
              ].map(tag => (
                <div
                  key={tag.text}
                  className="rounded-[8px] px-1 py-[2px] bg-[#8881] text-[12px] leading-[16px] font-semibold"
                  style={{ color: tag.color }}
                >
                  {tag.text}
                </div>
              ))}
            </div>
          </div>
        </>
      }
    />
  )
}
