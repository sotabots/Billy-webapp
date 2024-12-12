import type { ChangeEvent } from 'react'
import { useRef } from 'react'

export const InputText = ({ placeholder, value, onChange }: {
  placeholder?: string
  value: string
  onChange?: (value: string) => void
}) => {
  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) {
      return
    }
    const changedString = e.target.value
    onChange(changedString)
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollOnFocus = () => {
    if (inputRef.current) {
      const offset = inputRef.current.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className="InputText block w-full h-10 p-2 rounded-[8px] border border-separator bg-bg text-text text-[14px] leading-[20px] focus:ring-2 focus:ring-blue focus:outline-none appearance-none transition-all placeholder:text-textSec2 selection:bg-blue selection:text-textButton"
        inputMode="text"
        placeholder={placeholder}
        value={value}
        onFocus={(e) => {
          e.target.select()
          scrollOnFocus()
        }}
        onChange={onChangeString}
      />
    </>
  )
}
