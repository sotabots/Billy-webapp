// import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

import { ReactComponent as Back } from '../assets/back.svg'

type THeader = {
  onBack?: () => void
  // onCancel?: MouseEventHandler<HTMLButtonElement>
}

function Header({ onBack /*, onCancel */ }: THeader) {
  const { t } = useTranslation()
  if (window.Telegram?.WebApp.platform !== 'unknown') {
    return (
      <div className="h-3">
        {onBack && (
          <BackButton
            onClick={onBack}
          />
        )}
      </div>
    )
  }

  return (
    <header className="relative flex items-center justify-center h-[64px]">
      {/* {onCancel &&
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-link hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onCancel}>{t('cancel')}</button>
      } */}
      {onBack &&
        <button className="flex items-center gap-[5px] absolute left-4 top-1/2 -translate-y-1/2 text-link hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onBack}>
          <Back />
          <span>{t('back')}</span>
        </button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-semibold">Billy</div>
        <div className="text-hint text-[13px] leading-[18px] font-semibold opacity-70">{t('bot')}</div>
      </div>
    </header>
  )
}

export default Header
