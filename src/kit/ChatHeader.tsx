import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { useUser, useGetVoiceLimit } from '../hooks'
import { Avatar } from './Avatar'
import { VoiceLimit } from './VoiceLimit'

export const ChatHeader = ({ className }: {
  className?: string
}) => {
  const { t } = useTranslation()
  const { me } = useUser()
  const { data } = useGetVoiceLimit()
  console.log('useGetVoiceLimit data', data)

  return (
    <div className={cx(
      'ChatHeader px-4 pt-3',
      className,
     )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-2 truncate">
          <div className="text-[24px] leading-[32px] font-semibold truncate">{t('thisChat')}</div>
          {undefined &&
            <VoiceLimit limit={null} />
          }
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
