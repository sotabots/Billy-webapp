import cx from 'classnames'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Avatar } from '../kit'

import { TUser } from '../types'

export const User = ({ user, size = 40, secondRow, spokenName, className }: {
  user?: TUser
  size?: number
  secondRow?: false | ReactNode
  spokenName?: string | null
  className?: string
}) => {
  const { t } = useTranslation()

  return (
    <div className={cx('w-full flex gap-2 items-center text-[16px] leading-[20px] truncate', className)}>
      <Avatar user={user} size={size} />
      <div className="flex flex-col -gap-0.5 flex-1 text-left truncate">
        {!user ? (
          <>
            {spokenName && (
              <div className="font-medium truncate">{spokenName}</div>
            )}
            <div className="text-[14px] leading-[20px] text-red truncate">{t('select')}</div>
          </>
        ) : (
          <>
            <div className="truncate">
              {spokenName ? (
                <span className="font-medium">{spokenName}</span>
              ) : (
                <span>{user.first_name} {user.last_name}</span>
              )}
            </div>
            {secondRow || (secondRow === undefined && (
              user.username ? (
                <div className="text-[14px] leading-[18px] text-textSec truncate">
                  @{user.username}
                </div>
              ) : (
                !!spokenName && (!!user.first_name || !!user.last_name) && (
                  <div className="text-[14px] leading-[18px] text-textSec truncate">
                    {user.first_name} {user.last_name}
                  </div>
                )
              )
            ))}
          </>
        )}
      </div>
    </div>
  )
}
