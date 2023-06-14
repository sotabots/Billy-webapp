import { MouseEventHandler } from 'react'
import { ReactNode } from 'react'

type TButton = {
  children: ReactNode,
  onClick: MouseEventHandler<HTMLButtonElement>
}

function Button({ children, onClick }: TButton) {

  return (
    <button
      className="w-full h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
