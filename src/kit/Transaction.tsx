import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TTransaction } from '../types'

import Button from './Button'
import CategoryAvatar from './CategoryAvatar'

import { useUsers, useCurrencies, useFeedback, useTransaction } from '../hooks'

import { ReactComponent as EditIcon } from '../assets/edit.svg'

import { useStore } from '../store'
import { formatAmount } from '../utils'

import cashback from '../assets/cashback.png'

const Transaction = ({ tx }: { tx: TTransaction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { setTxId, setIsEditTx } = useStore()
  const { getUserById } = useUsers()
  const { getCurrencyById } = useCurrencies()
  const { feedback } = useFeedback()

  const { getMyBalanceDelta } = useTransaction()
  const myBalanceDelta = getMyBalanceDelta(tx)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

  const currency = getCurrencyById(tx.currency_id)
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0)
  const cashbackAmount = tx.cashback ? payerSharesAmount * tx.cashback : null

  return (
    <div className="Transaction flex gap-2">
      <CategoryAvatar tx={tx} isCategoryName={false} />
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
          <div className="flex-1 opacity-60 first-letter:uppercase">{tx.nutshell}</div>
          {!!cashbackAmount && (
            <div className="flex gap-1 items-center rounded-[8px] px-1 py-[2px] bg-[#ff960020] text-[12px] leading-[16px] font-semibold">
              <img className="block w-3 h-3" src={cashback} />
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
            ...(editor ? [{
              text: `${t('statusEditedBy')} ${[editor.first_name, editor.last_name].filter(_ => _).join(' ') }`,
            }] : []),
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
      <Button
        // disabled
        theme="clear"
        className="w-6 h-6"
        text={<EditIcon />}
        onClick={() => {
          setTxId(tx._id)
          setIsEditTx(true)
          navigate('/check')
          feedback('edit_transaction_total_web', {
            txId: tx._id
          })
        }}
      />
    </div>
  )
}

export default Transaction
