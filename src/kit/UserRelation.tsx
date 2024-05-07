import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

import { useUsers } from '../hooks'
import { TShare } from '../types'

import User from './User'

import { ReactComponent as NextIcon } from '../assets/next.svg'

type TProps = TShare & {
  onClick: MouseEventHandler<HTMLButtonElement>
}

function UserRelation({ normalized_name, related_user_id, onClick }: TProps) {
  const { t } = useTranslation()
  const { getUserById } = useUsers()
  const user = related_user_id ? getUserById(related_user_id) : undefined

  return (
    <button
      className="w-full flex gap-3 text-left items-center px-4 py-2.5 truncate hover:bg-text/5 active:bg-text/10 transition-all"
      onClick={onClick}
    >
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
      <div className="flex w-[55%] truncate">
        <User /*size={32}*/ user={user} />
      </div>
      <div className="h-6 w-6 text-hint opacity-50">
        <NextIcon />
      </div>
    </button>
  )
}

export default UserRelation
