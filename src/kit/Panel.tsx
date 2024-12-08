import cx from 'classnames'
import { ReactNode } from 'react'

export const Panel = ({ className, children, description }: {
  className?: string
  children: ReactNode
  description?: string
}) => {
  return (
    <>
      {/* todo: p-4 only */}
      <div className={cx('Panel p-4 pb-6 rounded-3xl bg-bg', className)}>
        {children}
      </div>
      {description &&
        <div className="Panel-description mt-1 mb-4 text-[14px] leading-[20px] text-textSec2">{description}</div>
      }
    </>
  )
}
