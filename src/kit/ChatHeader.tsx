import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useUser, useGetVoiceLimit, useStore } from '../hooks'
import { Avatar, VoiceLimit, Button } from '../kit'

export const ChatHeader = ({ className }: {
  className?: string
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { me } = useUser()
  const { data: voiceLimit } = useGetVoiceLimit()

  const { chat, isDebug } = useStore()
  if (!isDebug) {
    return null
  }

  return (
    <div className={cx(
      'ChatHeader px-4 pt-3',
      className,
     )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-2 truncate">
          <div className="text-[24px] leading-[32px] font-semibold truncate">{chat ? (chat.name || t('thisChat')) : ''}</div>
          <VoiceLimit limit={voiceLimit} />
        </div>

        <Button
          wrapperClassName="flex-nowrap"
          onClick={() => { navigate('/profile') }}
        >
          <Avatar
            size={32}
            user={me}
          />
        </Button>
      </div>
    </div>
  )
}
