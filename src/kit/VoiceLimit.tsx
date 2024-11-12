import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { Button } from '../kit'

import { ReactComponent as Voice } from '../assets/voice.svg'

export const VoiceLimit =({ className, theme, limit }: {
  className?: string
  theme?: 'gray'
  limit?: number
}) => {
  const { t } = useTranslation()

  if (limit === undefined) {
    return null
  }

  return (
    <Button
      wrapperClassName='h-6'
      className={cx(
        'VoiceLimit h-6 rounded-full pl-2 pr-3',
          limit === -1 ? 'border border-[#0E73F6] text-[#0E73F6]' :
          // eslint-disable-next-line no-constant-condition
          (true || theme === 'gray') ? 'bg-bg2 text-textSec' :
          'border border-[#CC0905]/20 text-[#d0baba]',
        className,
      )}
      onClick={() => { /* */ }}
    >
      <div className="flex items-center gap-1">
        <Voice className="w-4 h-4" />
        <div className="text-[14px] leading-[24px] font-semibold">{limit === -1 ? t('unlimited') : `${limit} ${t('left')}`}</div>
      </div>
    </Button>
  )
}
