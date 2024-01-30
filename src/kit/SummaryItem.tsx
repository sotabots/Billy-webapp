import { useTranslation } from 'react-i18next'

import Button from './Button'

import User from './User'
import { useUsers } from '../hooks'
import { TSummaryItem } from '../types'

import { ReactComponent as ToSmallIcon } from '../img/to-small.svg'

import { formatAmount } from '../utils'

type TSummaryItemProps = TSummaryItem & {
  onClick: () => void
}

function SummaryItem({ from_user, to_user, amount, onClick }: TSummaryItemProps) {
  const { t } = useTranslation()

  const { getUserById } = useUsers()

  const fromUser = getUserById(from_user._id)
  const toUser = getUserById(to_user._id)

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="flex gap-3 items-center">
      <User
        user={fromUser}
        size={48}
        secondRow={(
          <div className="mt-1 flex gap-1 items-center">
            <div className="flex items-center">
              <div className="w-4 h-3">
                <ToSmallIcon />
              </div>
              <div className="text-[14px] leading-[24px] font-semibold">{formatAmount(amount)}</div>
            </div>
            <User
              user={toUser}
              size={24}
              secondRow={false}
              className="gap-[2px] !text-[14px] !leading-[20px] text-hint"
            />
          </div>
        )}
      />

      <Button
        theme="settleUp"
        text={t('settleUp')}
        onClick={onClick}
      />
    </div>
  )
}

export default SummaryItem
