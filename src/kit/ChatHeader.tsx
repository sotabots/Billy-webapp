import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { useUser } from '../hooks'
import { Avatar } from './Avatar'

export const ChatHeader =({ className }: {
  className?: string
}) => {
  const { t } = useTranslation()
  const { me } = useUser()

  return (
    <div className={cx(
      'ChatHeader px-4 pt-3',
      className,
     )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-2 truncate">
          <div className="text-[24px] leading-[32px] font-semibold truncate">{t('thisChat')}</div>
        </div>

        <div className="flex-nowrap">
          <Avatar
            size={32}
            user={me}
          />
        </div>
      </div>
    </div>
  )
}
