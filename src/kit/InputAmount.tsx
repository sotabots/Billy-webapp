import type { ChangeEvent } from 'react'
import { useEffect, useState, useRef } from 'react'

import { formatAmount, unformatAmount } from '../utils'
import { visible_decimals } from '../const'

const filter = ({ oldString, newStringRaw, decimals, max }: {
  oldString: string
  newStringRaw: string
  decimals: number
  max?: number
}) => {
  const MAX_DECIMALS = decimals
  const MAX_LENGTH = 10

  const WITHOUT_CHARS = /[^0-9.]/
  const newString = newStringRaw.replace(/,/g, '.').replace(WITHOUT_CHARS, '')

  const NUMERIC = /^\d*.?\d*$/
  if (!NUMERIC.test(newString)) {
    return oldString
  }

  if (max && parseFloat(newString) > max) {
    return String(max)
  }

  if (newString.length > MAX_LENGTH) {
    return oldString
  }

  if (MAX_DECIMALS === 0 && newString.includes('.')) {
    return oldString
  }

  const [oldStringBeforeDot, oldStringAfterDot] = oldString.split('.')
  const [newStringBeforeDot, newStringAfterDot] = newString.split('.')

  if (oldStringBeforeDot === '0' && newStringBeforeDot === '00') {
    return oldString
  }

  if (
    MAX_DECIMALS > 0 &&
    oldStringAfterDot === '0'.repeat(MAX_DECIMALS - 1) &&
    newStringAfterDot === '0'.repeat(MAX_DECIMALS)
  ) {
    return oldString
  }

  if (newStringAfterDot && newStringAfterDot.length > MAX_DECIMALS) {
    return oldString
  }

  if (MAX_DECIMALS > 0 && oldString === '' && newString === '.') {
    return '0.'
  }

  if (oldString === '0.' && newString === '0') {
    return ''
  }

  if (MAX_DECIMALS > 0 && oldString !== '0.' && newString === '0') {
    return '0.'
  }

  return newString
}

function InputAmount({ amount, onChange, decimals = visible_decimals, unit, max }: {
  amount: number
  onChange?: (value: number) => void
  decimals?: number
  unit?: string
  max?: number
}) {
  const [currentString, setCurrentString] = useState<string>(formatAmount(amount, decimals))

  useEffect(() => {
    const currentAmount = unformatAmount(currentString)
    if (amount !== currentAmount) {
      setCurrentString(formatAmount(amount, decimals))
    }
  }, [amount, currentString])

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return
    }
    const changedString = e.target.value
    const newString = filter({
      oldString: currentString,
      newStringRaw: changedString,
      decimals,
      max
    })
    setCurrentString(newString)
    const newAmount = unformatAmount(newString)
    onChange(newAmount)
  }

  const onBlur = () => {
    setCurrentString(formatAmount(amount, decimals))
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollOnFocus = () => {
    if (inputRef.current) {
      const offset = inputRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className="w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#303940] text-right text-[16px] text-text dark:text-[#FFFFFF] leading-[24px] focus:ring-2 focus:ring-button focus:outline-none appearance-none transition-all selection:bg-button selection:text-buttonText"
        inputMode="decimal"
        placeholder="0"
        value={currentString}
        onFocus={(e) => {
          e.target.select()
          scrollOnFocus()
        }}
        onBlur={onBlur}
        onChange={onChangeString}
      />
      {unit &&
        <span className="px-[0.4em] -mr-6">{unit}</span>
      }
    </>
  )
}

export default InputAmount
