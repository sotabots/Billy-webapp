import Avatar from './Avatar'

import { TUser } from '../types'

type TProps = {
  user: TUser
}

function User({ user }: TProps) {
  const fullName = [
    ...(user?.first_name ? [user.first_name] : []),
    ...(user?.last_name ? [user.last_name] : []),
  ].join(' ')
  return (
    <div className="w-full flex gap-3 items-center">
    <Avatar url={user?.profile_photo} size={40} fullName={fullName} />
      <div className="flex flex-col -gap-0.5 flex-1 text-left truncate">
        <div className="truncate">{user.first_name} {user.last_name}</div>
        {user.username && (
          <div className="text-[14px] leading-[20px] text-hint truncate">
            @{user.username}
          </div>
        )}
      </div>
    </div>
  )
}

export default User
