type TProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export const Textarea = ({ value, placeholder, onChange }: TProps) => {
  return (
    <textarea
      className="w-full h-[80px] p-2 rounded-md border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#303940] text-[16px] text-text dark:text-[#FFFFFF] leading-[24px] focus:ring-2 focus:ring-blue focus:outline-none appearance-none transition-all selection:bg-blue selection:text-textButton resize-none"
      value={value}
      placeholder={placeholder}
      onChange={(e) => { onChange(e.target.value) }}
    />
  )
}
