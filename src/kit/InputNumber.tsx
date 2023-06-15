import type { ChangeEvent } from 'react'

type TInputNumber = {
  value?: number
  onChange?: (value: number) => void
}

function InputNumber({ value, onChange }: TInputNumber) {
  const inputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    // todo: .,
    const number = Number(e.target.value)
    onChange?.(number)
  }

  return (
    <input
      type="text"
      className="w-full h-10 p-2 rounded-md border border-[#DDE2E4] text-right text-[16px] leading-[24px]"
      inputMode="decimal"
      value={value}
      onChange={inputOnChange}
    />
  )
}

export default InputNumber
