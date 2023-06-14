import { ReactNode } from 'react'

type TButton = {
  children: ReactNode
}

function Button({ children }: TButton) {

  return (
    <button className="w-full h-10 bg-button text-buttonText rounded-md text-[14px] leading-[20px] font-semibold">{children}</button>
  )
}

export default Button
