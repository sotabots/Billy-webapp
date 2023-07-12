import { MouseEventHandler } from 'react'
import { ReactNode } from 'react'

type TButton = {
  children: ReactNode,
  onClick: MouseEventHandler<HTMLButtonElement>
}

function Button({ children, onClick }: TButton) {

  return (
    <button
      className="mx-auto w-full max-w-[500px] md:max-w-[300px] block h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold hover:brightness-110 active:brightness-[1.2] transition-all"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
