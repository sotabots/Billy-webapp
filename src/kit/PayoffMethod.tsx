import cx from 'classnames'

import { TPayoffMethod } from '../types'
import { Button, Avatar } from '../kit'

import { ReactComponent as Next } from '../assets/next.svg'

export const PayoffMethod =({ className, payoffMethod, onClick }: {
  className?: string
  payoffMethod: TPayoffMethod
  onClick: () => void
}) => {
  return (
    <Button
      className={cx(
        'PayoffMethod w-full flex items-center gap-3 px-4 py-2',
        className,
      )}
      onClick={onClick}
    >
      <Avatar url={payoffMethod.image} />
      <div className="flex-1 text-left">
        <div className="text-[16px] leading-[24px]">{payoffMethod.title}</div>
      </div>
      <Next className="w-6 h-6 text-icon" />
    </Button>
  )
}
