import cx from 'classnames'

import { Button } from '../kit'

export const Toggle = ({ size, label, value, onChange }: {
  size?: 'big'
  label?: string,
  value: boolean,
  onChange?: (value: boolean) => void
}) => {
  return (
    <Button
      className="flex gap-1 items-center min-h-[24px]"
      onClick={() => { onChange?.(!value) }}
    >
      <>
        <div className={cx(
          'relative transition-all',
          size === 'big' ? 'w-[32px] h-[20px] rounded-[10px]' : 'w-[22px] h-[12px] rounded-[6px]',
          value ? 'bg-blue' : 'bg-[#B0BABF]',
        )}>
          <div className={cx(
            'absolute top-[50%] -translate-y-[50%] rounded-full bg-white transition-all',
            size === 'big' ? 'h-4 w-4' : 'h-2 w-2',
            value ? 'right-[2px]' :
              size === 'big' ? 'right-[14px]' : 'right-[12px]'
          )} />
        </div>
        {label &&
          <div className="flex-1 text-[14px] leading-6 text-blue">{label}</div>
        }
      </>
    </Button>
  )
}
