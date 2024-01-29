import { useTranslation } from 'react-i18next'

import User from './User'
import { useUsers } from '../hooks'
import { TSummaryItem } from '../types'

type TUserAmount = TSummaryItem & {
  onClick: () => void
}

function SummaryItem({ from_user, to_user, amount, onClick }: TUserAmount) {
  const { t } = useTranslation()

  const { getUserById } = useUsers()
  const fromUser = getUserById(from_user._id)
  const toUser = getUserById(to_user._id)

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="flex gap-3">
      <User user={fromUser} size={48} />

      <div className="font-semibold">{amount}</div>

      <button onClick={onClick}>
        {t('settleUp')}
      </button>
    </div>
  )
}

export default SummaryItem
