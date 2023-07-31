import type { ChangeEvent } from 'react'

type TInputAmount = {
  amount?: number
  onChange: (value: number) => void
}

function InputAmount({ amount, onChange }: TInputAmount) {
  const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    // todo: .,
    const number = Number(e.target.value) || 0
    onChange(number)
  }

  return (
    <input
      type="text"
      className="w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#D5DADD] text-right text-[16px] text-text dark:text-[#48535B] leading-[24px] focus:ring-2 focus:ring-button focus:outline-none appearance-none transition-all selection:bg-button selection:text-buttonText"
      inputMode="decimal"
      value={amount}
      onFocus={(e) => { e.target.select() }}
      onChange={inputOnChange}
    />
  )
}

export default InputAmount
