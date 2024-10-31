import cx from 'classnames'

import { ReactComponent as CheckIcon } from '../assets/check.svg'

export const CheckBox = ({ className, isChecked }: {
  className?: string
  isChecked: boolean
}) => {
  return (
    <div className={cx(
      'CheckBox h-5 w-5 rounded-[4px] flex items-center justify-center border transition-all',
      !isChecked ? 'bg-[#F6F8F9] border-[#B0BABF]' : 'bg-blue border-blue',
      className,
    )}>
      <CheckIcon className={cx(
        'w-3 h-3 text-white transition-all',
        !isChecked ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      )} />
    </div>
  )
}
