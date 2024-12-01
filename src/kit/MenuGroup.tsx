import cx from 'classnames'
import type { ReactNode } from 'react'

export const MenuGroup = ({ className, children, description }: {
  className?: string
  children: ReactNode
  description?: string
}) => {
  return (
    <div className={cx('MenuGroup', className)}>
      <div className="MenuGroup-inner rounded-[12px] bg-bg overflow-hidden">
        {children}
      </div>
      {description &&
        <div className="MenuGroup-description ml-4 mt-1 text-[14px] leading-[20px] text-textSec2">{description}</div>
      }
    </div>
  )
}
