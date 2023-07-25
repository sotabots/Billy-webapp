import { MouseEventHandler } from 'react'
import Avatar from './Avatar'

import { TUser } from '../types'

type TProps = TUser & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

function User({ url, fullName, username, onClick }: TProps) {
  return (
    <button className="w-full flex gap-2 px-4 py-2 items-center hover:bg-text/5 active:bg-text/10 transition-all" onClick={onClick}>
      <Avatar url={url} size={40} fullName={fullName} />
      <div className="flex-1 truncate text-left">
        @{username}
      </div>
    </button>
  )
}

export default User
