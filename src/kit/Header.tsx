// import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

import { ReactComponent as Back } from '../assets/back.svg'
import { usePlatform } from '../hooks'

export const Header = ({ onBack /*, onCancel */ }: {
  onBack?: () => void
}) => {
  const { t } = useTranslation()
  const { isTg } = usePlatform()

  const _onBack =
    onBack ? onBack :
    (history.state && history.state?.idx && history.state?.idx !== 0) ? () => { history.back()} :
    undefined

  if (isTg) {
    return (
      <div className="h-3">
        {!!_onBack && (
          <BackButton
            onClick={_onBack}
          />
        )}
      </div>
    )
  }

  return (
    <header className="Header sticky z-[1] top-0 flex items-center justify-center h-[64px] bg-bg">
      {!!_onBack &&
        <button
          className="flex items-center gap-[5px] absolute left-4 top-1/2 -translate-y-1/2 text-blue hover:brightness-[1.2] active:brightness-[1.4] transition-all"
          onClick={_onBack}
        >
          <Back />
          <span>{t('back')}</span>
        </button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-semibold">Billy</div>
        <div className="text-textSec text-[13px] leading-[18px] font-semibold opacity-70">{t('bot')}</div>
      </div>
    </header>
  )
}
