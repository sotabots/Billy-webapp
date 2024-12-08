import cx from 'classnames'
import { ReactNode } from 'react'

import { Button } from '../kit'

export type TSwitchItem = {
  value: string
  title: string | ReactNode
}

export const Switch =({ className, items, value, onChange, disabled }: {
  className?: string
  items: TSwitchItem[],
  value: string | undefined
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  return (
    <div className={cx('Switch flex items-center p-1 rounded-[12px] bg-bg', className)}>
      {items.map(item => (
        <div
          key={`Switch-item-${item.value}}`}
          className="Switch-item flex flex-grow basis-0"
        >
          <Button
            wrapperClassName="w-full"
            className={cx(
              'w-full flex items-center justify-center gap-[2px] p-2 rounded-[8px]',
              value === item.value ? 'bg-text/5' : 'text-text/70',
            )}
            onClick={() => { onChange(item.value) }}
            disabled={disabled}
          >
            {item.title}
          </Button>
        </div>
      ))}
    </div>
  )
}
