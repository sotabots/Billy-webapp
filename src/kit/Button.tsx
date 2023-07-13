import { MouseEventHandler } from 'react'
import { ReactNode } from 'react'

type TButton = {
  children: ReactNode,
  disabled?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

function Button({ children, disabled, onClick }: TButton) {

  return (
    <button
      className="mx-auto w-full max-w-[500px] md:max-w-[300px] block h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-[1.2] disabled:opacity-40 transition-all"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
