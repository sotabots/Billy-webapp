import { useInitData } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { TShare, TTransaction } from '../types'

import Button from '../kit/Button'

import { useUsers } from '../hooks'

import { ReactComponent as EditIcon } from '../assets/edit.svg'

import { useStore } from '../store'
import { formatAmount } from '../utils'

const Transaction = ({ tx }: { tx: TTransaction }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [initDataUnsafe] = useInitData()
  const { setTxId, setIsEditTx, categories } = useStore()
  const { getUserById } = useUsers()

  const category = categories?.[tx.category || '']
  const backgroundColor = category?.hue ? `hsla(${category.hue}, 100%, 74%, 1)` : '#8884'
  const emoji = category?.emoji || ' '

  const myShare: TShare | undefined =
    tx.shares.find(share => share.related_user_id === initDataUnsafe.user?.id && share.is_payer === true) ||
    tx.shares.find(share => share.related_user_id === initDataUnsafe.user?.id && share.is_payer === false)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  const editor = !tx.editor_user_id ? null : getUserById(tx.editor_user_id) || null

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
            <span>{formatAmount(payerShare.amount)} {tx.currency_id}</span>
          </div>
        ))}
        {!!myShare && !(!tx.is_confirmed || tx.is_canceled) && (
        <div className={cx(
          'flex gap-2 items-center justify-between rounded-[4px] px-2 bg-[#8881] font-semibold',
          myShare.is_payer ? 'text-[#119C2B]' : 'text-[#CC0905]'
        )}>
          <span>{myShare.is_payer ? t('youLent') : t('youOwe')}</span>
          <span>{formatAmount(myShare.amount)} {tx.currency_id}</span>
        </div>
        )}
        {!!tx.nutshell && (
          <div className="px-2 opacity-60 first-letter:uppercase">{tx.nutshell}</div>
        )}
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
