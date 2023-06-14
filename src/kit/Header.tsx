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
      <div className="flex flex-row items-center justify-center gap-2">
        <div>Split</div>
        <div>бот</div>
      </div>
    </header>
  )
}

export default Header
