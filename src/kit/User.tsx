import cx from 'classnames'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import Avatar from './Avatar'

import { TUser } from '../types'

type TProps = {
  user?: TUser
  size?: number
  secondRow?: false | ReactNode
  className?: string
}

function User({ user, size = 40, secondRow, className}: TProps) {
  const { t } = useTranslation()

  return (
    <div className={cx('w-full flex gap-2 items-center text-[16px] leading-[20px] truncate', className)}>
      <Avatar user={user} size={size} />
      <div className="flex flex-col -gap-0.5 flex-1 text-left truncate">
        {!user ? (
          <div className="text-error truncate">{t('select')}</div>
        ) : (
          <>
            <div className="truncate">{user.first_name} {user.last_name}</div>
            {secondRow || (secondRow === undefined && user.username && (
              <div className="text-[14px] leading-[18px] text-hint truncate">
                @{user.username}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default User
