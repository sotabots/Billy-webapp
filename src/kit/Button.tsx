import { ReactNode } from 'react'

type TButton = {
  children: ReactNode
}

function Button({ children }: TButton) {

  return (
    <button className="w-full h-10 bg-[#4094F7] text-[#F6F8F9] rounded-md text-[14px] leading-[20px] font-semibold">{children}</button>
  )
}

export default Button
