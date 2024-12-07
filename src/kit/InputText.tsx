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
        className="InputText w-[117px] h-10 p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#303940] text-right text-[16px] text-text leading-[24px] focus:ring-2 focus:ring-blue focus:outline-none appearance-none transition-all selection:bg-blue selection:text-textButton"
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
