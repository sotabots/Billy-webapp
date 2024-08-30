import Divider from '../kit/Divider'
import UserButton from '../kit/UserButton'

import { TUser } from '../types'

export const UsersGroup = ({ users, onClick }: {
  users: TUser[]
  onClick: (_: TUser) => void
}) => {
  return (
    <div className="mt-4 overflow-y-auto">
      {users.map((user, i, arr) => (
        <>
          <UserButton
            key={i}
            user={user}
            onClick={() => { onClick(user) }}
          />
          {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
        </>
      ))}
    </div>
  )
}
