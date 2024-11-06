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
        'VoiceLimit h-6 border rounded-full pl-2 pr-3',
        theme === 'gray' ? 'border-[#9AA6AC] text-[#9AA6AC]' :
          limit === -1 ? 'border-[#0E73F6] text-[#0E73F6]' :
          'border-[#CC0905]/20 text-[#CC0905]',
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
