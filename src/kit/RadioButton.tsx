import cx from 'classnames'
import { TCurrencyId } from '../types'
import { ReactNode } from 'react'

export const RadioButton = ({ reverse, group, label, value, checked, onChange }: {
  reverse?: boolean
  group: string
  label: string | ReactNode
  value: TCurrencyId
  checked: boolean
  onChange: (value: TCurrencyId) => void
}) => {
  return (
    <label
      className={cx(
        'w-full flex gap-2 items-center px-4 py-2 cursor-pointer select-none hover:bg-text/5 active:bg-text/10 transition-all',
        reverse && 'flex-row-reverse'
      )}
      htmlFor={`${group}-${value}`}
      onClick={() => onChange(value)}
    >
      <input
        className="hidden"
        id={`${group}-${value}`}
        name={group}
        // value={value}
        checked={checked}
      />
      <div className="p-1.5">
        <div
          className={cx(
            'flex items-center justify-center w-5 h-5 border-2 rounded-full',
            checked ? 'border-blue' : 'border-textSec'
          )}
        >
          <div className={cx('w-[10px] h-[10px] rounded-full bg-blue opacity-0 transition-all', checked && '!opacity-100')} />
        </div>
      </div>
      <div className="flex-1">{label}</div>
    </label>
  )
}
