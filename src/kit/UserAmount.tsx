import Avatar from './Avatar'
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
  const fullName = [
    ...(user?.first_name ? [user?.first_name] : []),
    ...(user?.last_name ? [user?.last_name] : []),
  ].join(' ')

  if (!user) {
    return null
  }

  return (
    <div className="flex gap-3">
      <Avatar url={user.profile_photo} size={48} fullName={fullName} />
      <div className="flex flex-col -gap-0.5 flex-1 truncate">
        <div className="truncate">{user.first_name} {user.last_name}</div>
        {user.username && (
          <div className="text-[14px] leading-[20px] text-hint truncate">@{user.username}</div>
        )}
      </div>
      <InputAmount amount={amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
