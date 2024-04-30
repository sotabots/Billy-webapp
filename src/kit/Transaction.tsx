import { useInitData } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TShare, TTransaction } from '../types'

import Button from '../kit/Button'

import { useCategories, useUsers, useCurrencies } from '../hooks'

import { ReactComponent as EditIcon } from '../assets/edit.svg'

import { useStore } from '../store'
import { formatAmount } from '../utils'

import cashback from '../assets/cashback.png'

const Transaction = ({ tx }: { tx: TTransaction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [initDataUnsafe] = useInitData()
  const { setTxId, setIsEditTx } = useStore()
  const { getUserById } = useUsers()
  const { getCurrencyById } = useCurrencies()
  const { getCategoryColor, getCategoryEmoji } = useCategories()

  const backgroundColor = getCategoryColor(tx.category)
  const emoji = getCategoryEmoji(tx.category)

  const myShares: TShare[] = tx.shares.filter(share => share.related_user_id === initDataUnsafe.user?.id)
  const myBalanceDelta: number = myShares.reduce((acc, share) =>
    acc + share.amount * (share.is_payer ? 1 : -1)
  , 0)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

  const currency = getCurrencyById(tx.currency_id)
  const percent = 0.05
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0)
  const cashbackAmount = payerSharesAmount * percent

  return (
    <div className="Transaction flex gap-2">
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden text-[16px] leading-6"
        style={{ backgroundColor }}
      >
        {emoji}
      </div>
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
          myBalanceDelta > 0 && 'text-[#119C2B]',
          myBalanceDelta < 0 && 'text-[#CC0905]',
        )}>
          <span>{t('myBalance')}</span>
          <span>{myBalanceDelta < 0 ? '−' : '+'} {formatAmount(Math.abs(myBalanceDelta))}{currency?.symbol}</span>
        </div>
        )}
        <div className="flex gap-2 items-start justify-between px-2">
          <div className="flex-1 opacity-60 first-letter:uppercase">{tx.nutshell || 'test'}</div>
          <div className="flex gap-1 items-center rounded-[8px] px-1 py-[2px] bg-[#ff960020] text-[12px] leading-[16px] font-semibold">
            <img className="block w-3 h-3" src={cashback} />
            <span>{formatAmount(cashbackAmount)}{currency?.symbol}</span>
          </div>
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
            <div className="rounded-[8px] px-1 py-[2px] bg-[#8881] text-[12px] leading-[16px] font-semibold" style={{ color: tag.color }}>{tag.text}</div>
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
        }}
      />
    </div>
  )
}

export default Transaction
