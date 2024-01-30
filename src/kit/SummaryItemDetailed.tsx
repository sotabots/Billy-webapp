import User from './User'
import InputAmount from './InputAmount'
import { useUsers } from '../hooks'
import { TSummaryItem } from '../types'

type TSummaryItemDetailedProps = TSummaryItem & {
}

function SummaryItemDetailed({ from_user, to_user, amount  }: TSummaryItemDetailedProps) {
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

      <InputAmount amount={amount} />
    </div>
  )
}

export default SummaryItemDetailed
