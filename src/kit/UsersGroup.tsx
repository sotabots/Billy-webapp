import cx from 'classnames'
import Divider from '../kit/Divider'
import UserButton from '../kit/UserButton'

import { TUser } from '../types'

export const UsersGroup = ({ className, title, users, onClick }: {
  className?: string
  title?: string
  users: TUser[]
  onClick: (_: TUser) => void
}) => {
  return (
    <div className={cx('UsersGroup overflow-y-auto', className)}>
      {title &&
        <div className="mx-4 mb-2 text-[12px] leading-[16px] text-[#5B6871] font-semibold">{title}</div>
      }
      {users.map((user, i, arr) => (
        <>
          <UserButton
            key={`UserButton-${i}`}
            user={user}
            onClick={() => { onClick(user) }}
          />
          {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
        </>
      ))}
    </div>
  )
}
