import { MouseEventHandler } from 'react'

// import User from './User'
import InputAmount from './InputAmount'
import { useUsers } from '../hooks'
import { TShare } from '../types'

import UserRelation from '../kit/UserRelation'

type TUserAmount =  & {
  share: TShare
  onClick: MouseEventHandler<HTMLButtonElement>
  onChange: (value: number) => void
}

function UserAmount({ share, onClick, onChange }: TUserAmount) {
  const { getUserById } = useUsers()
  const user = share.related_user_id ? getUserById(share.related_user_id) : undefined

  if (!user) {
    return null
  }

  return (
    <div className="flex gap-3 items-center">
      {/* <User user={user} size={48} /> */}
      <UserRelation
        {...share}
        onClick={onClick}
      />
      <InputAmount amount={share.amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
