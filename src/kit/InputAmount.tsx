import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

type TInputAmount = {
  amount: number
  onChange: (value: number) => void
}

const filter = (oldString: string, newStringRaw: string) => {
  const MAX_DECIMALS = 2
  const MAX_LENGTH = 10

  const WITHOUT_CHARS = /[^0-9.]/
  const newString = newStringRaw.replace(/,/g, '.').replace(WITHOUT_CHARS, '')

  const NUMERIC = /^\d*.?\d*$/
  if (!NUMERIC.test(newString)) {
    return oldString
  }

  if (newString.length > MAX_LENGTH) {
    return oldString
  }

  const [oldStringBeforeDot, oldStringAfterDot] = oldString.split('.')
  const [newStringBeforeDot, newStringAfterDot] = newString.split('.')

  if (oldStringBeforeDot === '0' && newStringBeforeDot === '00') {
    return oldString
  }

  if (
    oldStringAfterDot === '0'.repeat(MAX_DECIMALS - 1) &&
    newStringAfterDot === '0'.repeat(MAX_DECIMALS)
  ) {
    return oldString
  }

  if (newStringAfterDot && newStringAfterDot.length > MAX_DECIMALS) {
    return oldString
  }

  if (oldString === '' && newString === '.') {
    return '0.'
  }

  if (oldString === '0.' && newString === '0') {
    return ''
  }

  if (oldString !== '0.' && newString === '0') {
    return '0.'
  }

  return newString
}

const amountFromString = (string: string) => parseFloat(string) || 0

const formatAmount = (amount: number) => amount.toFixed(2)

function InputAmount({ amount, onChange }: TInputAmount) {
  const [currentString, setCurrentString] = useState<string>(String(amount) || '')

  useEffect(() => {
    const currentAmount = amountFromString(currentString)
    if (amount !== currentAmount) {
      setCurrentString(formatAmount(amount))
    }
  }, [amount, currentString])

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    const changedString = e.target.value
    const newString = filter(currentString, changedString)
    setCurrentString(newString)
    const newAmount = amountFromString(newString)
    onChange(newAmount)
  }

  return (
    <input
      type="text"
      className="w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#D5DADD] text-right text-[16px] text-text dark:text-[#48535B] leading-[24px] focus:ring-2 focus:ring-button focus:outline-none appearance-none transition-all selection:bg-button selection:text-buttonText"
      inputMode="decimal"
      placeholder="0"
      value={currentString}
      onFocus={(e) => { e.target.select() }}
      onChange={onChangeString}
    />
  )
}

export default InputAmount
