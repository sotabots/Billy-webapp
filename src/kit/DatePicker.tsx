import cx from 'classnames'
import { useState } from 'react'

import { Button, OutsideClick } from '../kit'

import { ReactComponent as DateIcon } from '../assets/date.svg'
import { ReactComponent as DateClearIcon } from '../assets/date-clear.svg'

export const DatePicker = ({
  className,
  timestamp,
  placeholder,
  isRight,
  onChange,
}: {
  className?: string
  timestamp: number | null
  placeholder: string
  isRight?: boolean
  onChange: (timestamp: number | null) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <OutsideClick
      className={cx('DatePicker relative', className)}
      onClick={() => { setIsOpen(false) }}
    >
      <Button
        className={cx(
          'w-full h-8 p-[3px] pl-3 rounded-[6px] border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#D5DADD] text-[14px] leading-[24px] text-text dark:text-[#48535B] transition-all',
        )}
        onClick={() => { setIsOpen(!isOpen) }}
      >
        <div className="relative flex items-center pr-7">
          {timestamp ? (
            <span className="">{timestamp}</span>
          ) : (
            <span className={cx(
              'transition-all',
              !isOpen && 'opacity-40'
            )}>
              {placeholder}
            </span>
          )}
          <DateIcon className={cx(
            'absolute top-[50%] -translate-y-[50%] right-0 w-6 h-6 transition-all',
            timestamp ? '!opacity-0 pointer-events-none' : 'opacity-30 hover:opacity-50 active:opacity-70 active:opaity'
          )} />
        </div>
      </Button>
      <div className={cx(
        'absolute top-[50%] -translate-y-[50%] right-1 w-6 h-6 transition-all',
        !timestamp ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}>
        <Button
          className="opacity-30"
          theme="icon"
          onClick={() => {
            onChange(null)
            setIsOpen(false)
          }}
        >
          <DateClearIcon />
        </Button>
      </div>
      <div className={cx(
        'absolute top-[115%] w-[264px] h-[296px] rounded-[6px] border border-[#DDE2E4] dark:border-[#6E7C87] p-5 bg-bg transition-all origin-top',
        isRight ? 'right-0' : 'left-0',
        isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none',
      )}>
        <button
          onClick={() => {
            onChange(1)
            setIsOpen(false)
          }}
        >
          test
        </button>
      </div>
    </OutsideClick>
  )
}
