import cx from 'classnames'
import { useState } from 'react'

import Button from '../kit/Button'

import { ReactComponent as DateIcon } from '../assets/date.svg'
import { ReactComponent as DateClearIcon } from '../assets/date-clear.svg'

function DatePicker({
  className,
  timestamp,
  placeholder,
  onChange,
}: {
  className?: string
  timestamp: number | null
  placeholder: string
  onChange: (timestamp: number | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cx(
      'DatePicker relative',
      className
    )}>
      <Button
        theme="clear"
        className={cx(
          'w-full h-8 p-[3px] pl-3 rounded-[6px] border border-[#DDE2E4] dark:border-[#6E7C87] dark:bg-[#D5DADD] text-[14px] leading-[24px] text-text dark:text-[#48535B] transition-all',
        )}
        onClick={() => { setIsOpen(!isOpen) }}
        text={
          <div className="flex items-center justify-between gap-[6px]">
            {timestamp ? (
              <>
                <span>{timestamp}</span>
                <Button
                  theme="icon"
                  className="opacity-40"
                  text={<DateClearIcon />}
                  onClick={() => {
                    onChange(null)
                    setIsOpen(false)
                  }}
                />
              </>
            ) : (
              <>
                <span className={cx(
                  'transition-all',
                  !isOpen && 'opacity-40'
                )}>
                  {placeholder}
                </span>
                <DateIcon className="opacity-40" />
              </>
            )}
          </div>
        }
      />
      <div className={cx(
        'absolute top-[115%] w-[264px] h-[296px] rounded-[6px] border border-[#DDE2E4] dark:border-[#6E7C87] p-5 bg-bg',
        isOpen ? 'scale-100' : 'scale-0'
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
    </div>
  )
}

export default DatePicker
