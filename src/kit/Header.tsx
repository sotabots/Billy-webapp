import { MouseEventHandler } from 'react'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

import { ReactComponent as Back } from '../img/back.svg'

type THeader = {
  onBack?: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
}

function Header({ onBack, onCancel }: THeader) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (window?.Telegram?.WebView?.isIframe) {
    return (
      <>
        <BackButton
          onClick={onBack}
        />
      </>
    )
  }

  return (
    <header className="relative flex items-center justify-center h-[64px]">
      {onCancel &&
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-link hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onCancel}>Отмена</button>
      }
      {onBack &&
        <button className="flex items-center gap-[5px] absolute left-4 top-1/2 -translate-y-1/2 text-link hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onBack}>
          <Back />
          <span>Назад</span>
        </button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-semibold">Split</div>
        <div className="text-hint text-[13px] leading-[18px] font-semibold opacity-70">бот</div>
      </div>
    </header>
  )
}

export default Header
