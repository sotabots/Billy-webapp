import User from './User'
import InputAmount from './InputAmount'
import { useUsers } from '../hooks'
import { TSummaryItem } from '../types'

import { ReactComponent as ToIcon } from '../img/to.svg'

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
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <User user={fromUser} size={48} />
        <InputAmount amount={amount} />
      </div>
      <div className="flex gap-3 px-4">
        <div className="h-8 w-8">
          <ToIcon />
        </div>
        <User user={toUser} size={32} />
      </div>
    </div>
  )
}

export default SummaryItemDetailed
