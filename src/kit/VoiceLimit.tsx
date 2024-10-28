import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { Button } from '../kit'

import { ReactComponent as Voice } from '../assets/voice.svg'

export const VoiceLimit =({ className, theme, limit }: {
  className?: string
  theme?: 'gray'
  limit: null | number
}) => {
  const { t } = useTranslation()

  return (
    <Button
      theme='clear'
      wrapperClassName='h-6'
      className={cx(
        'VoiceLimit h-6 border rounded-full pl-2 pr-3',
        theme === 'gray' ? 'border-[#9AA6AC] text-[#9AA6AC]' :
          limit !== null ? 'border-[#CC0905]/20 text-[#CC0905]' :
          limit === null ? 'border-[#0E73F6] text-[#0E73F6]' :
          '',
        className,
      )}
      text={
        <div className="flex items-center gap-1">
          <Voice className="w-4 h-4" />
          <div className="text-[14px] leading-[24px] font-semibold">{limit !== null ? `${limit} ${t('left')}` : t('unlimited')}</div>
        </div>
      }
      onClick={() => { /* */ }}
    />
  )
}
