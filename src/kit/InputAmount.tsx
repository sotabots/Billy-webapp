import type { ChangeEvent } from 'react'

type TInputAmount = {
  amount?: number
  onChange?: (value: number) => void
}

function InputAmount({ amount, onChange }: TInputAmount) {
  const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    // todo: .,
    const number = Number(e.target.value)
    onChange?.(number)
  }

  return (
    <input
      type="text"
      className="w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] text-right text-[16px] leading-[24px] focus:ring-2 focus:ring-button focus:outline-none appearance-none transition-all"
      inputMode="decimal"
      value={amount}
      onChange={inputOnChange}
    />
  )
}

export default InputAmount
