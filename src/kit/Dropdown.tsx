import cx from 'classnames'
import { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import { useTheme } from '../hooks'
import { Button } from '../kit'

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg'
import { ReactComponent as DropdownCheck } from '../assets/dropdown-check.svg'

export const Dropdown = ({ className, items, value, onChange }: {
  className?: string,
  items: {
    text: string
    value: string
  }[],
  value: string,
  onChange: (value: string) => void
}) => {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <OutsideClickHandler onOutsideClick={() => { setIsOpen(false) }} >
      <div className={cx('Dropdown relative', className)}>
        <Button
          className="Dropdown-button flex items-center pl-2 pr-1 bg-separator rounded-[4px] font-semibold text-blue"
          onClick={() => { setIsOpen(!isOpen) }}
        >
          <div className="text-[14px] leading-[24px]">{items.find(item => item.value === value)?.text}</div>
          <DropdownIcon
            className={cx(
              'w-6 h-6 transition-all',
              isOpen ? '-rotate-180' : 'rotate-0',
            )}
          />
        </Button>
        <div
          className={cx(
            'Dropdown-list z-[1] absolute right-0 top-[118%] rounded-[4px] py-1 bg-bg dark:bg-separator origin-top transition-all',
            isOpen ? 'opacity-100 scale-y-100' : ' opacity-0 scale-y-0'
          )}
          style={!isDark ? { boxShadow: '0px 0px 2px 0px #0000001F, 0px 8px 16px 0px #0000001F' } : {}}
        >
          {items.map((item, i) => (
            <Button
              key={i}
              className={cx(
                'w-full flex items-center justify-between gap-4 px-3 py-2',
              )}
              onClick={() => {
                onChange(item.value)
                setIsOpen(!isOpen)
              }}
            >
              <div className="text-[14px] leading-[24px] text-left whitespace-nowrap">{item.text}</div>
              <DropdownCheck
                className={cx(
                  'w-6 h-6 text-blue transition-all',
                  item.value === value ? 'opacity-100' : 'opacity-0',
                )}
              />
            </Button>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  )
}