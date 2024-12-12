import cx from 'classnames'

import SelectIcon from '../assets/select.svg'


export type TSelectItem = {
  value: string
  title: string
}

export const Select =({ className, items, value, onChange, disabled }: {
  className?: string
  items: TSelectItem[],
  value: string | undefined
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  return (
    <select
      className={cx(
        'Select block w-full h-10 p-2 pr-10 rounded-[8px] border border-separator bg-bg text-text text-[14px] leading-[20px] focus:ring-2 focus:ring-blue focus:outline-none appearance-none transition-all selection:bg-blue selection:text-textButton',
        className,
      )}
      name="select"
      onChange={(e) => { onChange(e.target.value) }}
      disabled={disabled}
      style={{
        backgroundImage: `url(${SelectIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        backgroundSize: '24px 24px',
      }}
    >
      {items.map(item =>
        <option
          value={item.value}
          selected={item.value === value}
        >
          {item.title}
        </option>
      )}
    </select>
  )
}
