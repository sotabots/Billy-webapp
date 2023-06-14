import { MouseEventHandler } from "react"

type THeader = {
  onBack?: MouseEventHandler<HTMLButtonElement>
  onCancel?: MouseEventHandler<HTMLButtonElement>
}

function Header({ onBack, onCancel }: THeader) {
  return (
    <header className="relative flex items-center justify-center h-[64px]">
      {onCancel &&
        <button className="absolute left-2 top-1/2 -translate-y-1/2 text-link" onClick={onCancel}>Отмена</button>
      }
      {onBack &&
        <button className="absolute left-2 top-1/2 -translate-y-1/2 text-link" onClick={onBack}>Назад</button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-semibold">Split</div>
        <div className="text-hint text-[13px] leading-[18px] font-semibold opacity-70">бот</div>
      </div>
    </header>
  )
}

export default Header
