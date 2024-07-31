import cx from 'classnames'

import Button from '../kit/Button'

function Toggle({ label, value, onChange }: {
  label?: string,
  value: boolean,
  onChange?: (value: boolean) => void
}) {
  return (
    <Button
      theme="clear"
      className="flex gap-1 items-center min-h-[24px]"
      text={(
        <>
          <div className={cx(
            'relative w-[22px] h-[12px] rounded-[6px] transition-all',
            value ? 'bg-button' : 'bg-[#B0BABF]'
          )}>
            <div className={cx(
              'absolute top-[50%] -translate-y-[50%] h-2 w-2 rounded bg-white transition-all',
              value ? 'right-[2px]' : 'right-[12px]'
            )} />
          </div>
          {label &&
            <div className="flex-1 text-[14px] leading-6 text-button">{label}</div>
          }
        </>
      )}
      onClick={() => { onChange?.(!value) }}
    />
  )
}

export default Toggle
