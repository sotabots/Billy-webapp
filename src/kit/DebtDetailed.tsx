import User from './User'
import InputAmount from './InputAmount'
import { useUsers } from '../hooks'
import { TDebt } from '../types'

import { ReactComponent as ToIcon } from '../assets/to.svg'

type TDebtDetailedProps = TDebt & {
}

function DebtDetailed({ from_user, to_user, amount  }: TDebtDetailedProps) {
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
      <div className="flex items-center gap-3 px-6">
        <div className="h-[14px] w-[14px]">
          <ToIcon />
        </div>
        <User user={toUser} size={32} />
      </div>
    </div>
  )
}

export default DebtDetailed
