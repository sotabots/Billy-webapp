import Avatar from './Avatar'
import InputAmount from './InputAmount'
import { TTransactionPart } from '../types'

type TUserAmount = TTransactionPart & {
  amount: number
  onChange: (value: number) => void
}

function UserAmount({ user, amount, onChange }: TUserAmount) {
  if (!user) {
    return null
  }

  return (
    <div className="flex gap-3">
      <Avatar url={user.url} size={48} fullName={user.fullName} />
      <div className="flex flex-col -gap-0.5 flex-1 truncate">
        <div className="truncate">{user.fullName}</div>
        {user.username && (
          <div className="text-[14px] leading-[20px] text-hint truncate">@{user.username}</div>
        )}
      </div>
      <InputAmount amount={amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
