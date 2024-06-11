import cx from 'classnames'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import Avatar from './Avatar'

import { TUser } from '../types'

function User({ user, size = 40, secondRow, spokenName, className }: {
  user?: TUser
  size?: number
  secondRow?: false | ReactNode
  spokenName?: string | null
  className?: string
}) {
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
            <div className="text-[14px] leading-[20px] text-[#CC0905] truncate">{t('select')}</div>
          </>
        ) : (
          <>
            <div className="truncate">
              {/* 
              <div className="flex w-[35%] truncate">
                {normalized_name ? (
                  <div className="truncate">
                    {normalized_name === 'MESSAGE_AUTHOR'
                      ? <span className="opacity-30">({t('author')})</span>
                      : <span className="font-medium">{normalized_name}</span>
                    }
                  </div>
                ) : (
                  <div className="truncate opacity-30">({t('added')})</div>
                )}
              </div>
              */}
              {spokenName ? (
                <span className="font-medium">{spokenName}</span>
              ) : (
                <span>{user.first_name} {user.last_name}</span>
              )}
            </div>
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
