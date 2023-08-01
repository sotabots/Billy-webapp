import { MouseEventHandler } from 'react'

import { TTransactionPart } from '../types'

import Avatar from './Avatar'

import { ReactComponent as Next } from '../img/next.svg'

type TProps = TTransactionPart & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

function UserRelation({ spokenName, user, onClick }: TProps) {
  return (
    <button
      className="w-full flex gap-3 text-left items-center px-4 py-2.5 truncate hover:bg-text/5 active:bg-text/10 transition-all"
      onClick={onClick}
    >
      <div className="flex w-[45%] truncate">
        {spokenName ? (
          <div className="truncate">{spokenName}</div>
        ) : (
          <div className="truncate opacity-30">дополнительно</div>
        )}
      </div>
      <div className="flex gap-3 w-[45%] items-center truncate">
        <div className="w-8 h-8">
          <Avatar url={user?.url} size={32} fullName={user?.fullName} />
        </div>
        <div className="text-hint truncate">{user?.username ? `@${user.username}` : '(выберите)'}</div>
      </div>
      <div className="h-6 w-6 text-hint opacity-50">
        <Next />
      </div>
    </button>
  )
}

export default UserRelation
