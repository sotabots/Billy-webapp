import { MouseEventHandler } from 'react'
import Avatar from './Avatar'

import { TUser } from '../types'

type TProps = TUser & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

function User({ username, first_name, last_name, profile_photo, onClick }: TProps) {
  const fullName = [
    ...(first_name ? [first_name] : []),
    ...(last_name ? [last_name] : []),
  ].join(' ')
  return (
    <button className="w-full flex gap-2 px-4 py-2 items-center hover:bg-text/5 active:bg-text/10 transition-all" onClick={onClick}>
      <Avatar url={profile_photo} size={40} fullName={fullName} />
      <div className="flex-1 truncate text-left">
        @{username}
      </div>
    </button>
  )
}

export default User
