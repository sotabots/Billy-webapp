import { MouseEventHandler } from 'react'
import { ReactNode } from 'react'

type TButton = {
  children: ReactNode,
  theme?: 'default' | 'text'
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

function Button({ children, theme = 'default', disabled, onClick }: TButton) {
  const className = {
    'default': 'mx-auto w-full max-w-[500px] md:max-w-[300px] block h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] disabled:opacity-40 transition-all',

    'text': 'h-8 text-[14px] leading-[24px] text-button hover:brightness-[1.2] active:brightness-[1.4] transition-all'
  }[theme]

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
