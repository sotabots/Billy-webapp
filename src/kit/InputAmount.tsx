import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import { formatAmount, unformatAmount } from '../utils'
import { visible_decimals } from '../const'

type TInputAmount = {
  amount: number
  onChange?: (value: number) => void
}

const filter = (oldString: string, newStringRaw: string) => {
  const MAX_DECIMALS = visible_decimals
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

function InputAmount({ amount, onChange }: TInputAmount) {
  const [currentString, setCurrentString] = useState<string>(formatAmount(amount))

  useEffect(() => {
    const currentAmount = unformatAmount(currentString)
    if (amount !== currentAmount) {
      setCurrentString(formatAmount(amount))
    }
  }, [amount, currentString])

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return
    }
    const changedString = e.target.value
    const newString = filter(currentString, changedString)
    setCurrentString(newString)
    const newAmount = unformatAmount(newString)
    onChange(newAmount)
  }

  const onBlur = () => {
    setCurrentString(formatAmount(amount))
  }

  return (
    <input
      type="text"
      className="w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#D5DADD] text-right text-[16px] text-text dark:text-[#48535B] leading-[24px] focus:ring-2 focus:ring-button focus:outline-none appearance-none transition-all selection:bg-button selection:text-buttonText"
      inputMode="decimal"
      placeholder="0"
      value={currentString}
      onFocus={(e) => { e.target.select() }}
      onBlur={onBlur}
      onChange={onChangeString}
    />
  )
}

export default InputAmount
