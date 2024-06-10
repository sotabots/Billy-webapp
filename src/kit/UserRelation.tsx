import { MouseEventHandler } from 'react'

import { useUsers } from '../hooks'
import { TShare } from '../types'

import User from './User'

type TProps = TShare & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

function UserRelation({ normalized_name, related_user_id, onClick }: TProps) {
  const { getUserById } = useUsers()
  const user = related_user_id ? getUserById(related_user_id) : undefined

  return (
    <button
      className="w-full flex gap-3 text-left items-center px-2 py-1 rounded-[12px] truncate hover:bg-text/5 active:bg-text/10 transition-all"
      onClick={onClick}
    >
      <div className="flex truncate">
        <User size={48} user={user} spokenName={normalized_name} />
      </div>
    </button>
  )
}

export default UserRelation
