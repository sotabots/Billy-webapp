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
  const { setTxId } = useStore()
  const { getUserById } = useUsers()

  const backgroundColor = '#8884' || ['#82C4B8', '#B89AE4', '#FFBE7C', '#85BADA', '#FF9D97'][Math.floor(Math.random() * 5)]
  const emoji = ' ' || '🛒'

  const myShare: TShare | undefined =
    tx.shares.find(share => share.related_user_id === initDataUnsafe.user?.id && share.is_payer === true) ||
    tx.shares.find(share => share.related_user_id === initDataUnsafe.user?.id && share.is_payer === false)

  const payerShares = tx.shares
    .filter(share => share.is_payer)

  return (
    <div className="Transaction flex gap-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor }}>{emoji}</div>
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
        {!!myShare && (
        <div className={cx(
          'flex gap-2 items-center justify-between  rounded-[4px] px-2 bg-[#8881] font-semibold',
          myShare.is_payer ? 'text-[#119C2B]' : 'text-[#CC0905]'
        )}>
          <span>{myShare.is_payer ? t('youLent') : t('youOwe')}</span>
          <span>{formatAmount(myShare.amount)} {tx.currency_id}</span>
        </div>
        )}
        {/*
        <div className="px-2 opacity-60">Some short description about tx</div>
         */}
      </div>
      <Button
        // disabled
        theme="clear"
        className="w-6 h-6"
        text={<EditIcon />}
        onClick={() => {
          setTxId(tx._id)
          navigate('/check')
        }}
      />
    </div>
  )
}

export default Transaction
