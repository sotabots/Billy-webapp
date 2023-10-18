import User from './User'
import InputAmount from './InputAmount'
import { useUsers } from '../hooks/useUsers'
import { TShare } from '../types'

type TUserAmount = TShare & {
  amount: number
  onChange: (value: number) => void
}

function UserAmount({ related_user_id, amount, onChange }: TUserAmount) {
  const { getUserById } = useUsers()
  const user = related_user_id ? getUserById(related_user_id) : undefined

  if (!user) {
    return null
  }

  return (
    <div className="flex gap-3">
      <User user={user} size={48} />
      <InputAmount amount={amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
