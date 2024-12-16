import cx from 'classnames'
import type { ReactNode } from 'react'

export const Field =({ className, title, description, children }: {
  className?: string
  title?: string
  description?: string
  children: ReactNode
}) => {
  return (
    <div className={cx(
      'Field',
      className,
     )}
    >
      {!!title &&
        <div className="Field-title mb-1 ml-1 text-[14px] leading-[20px] text-textSec">{title}</div>
      }
      {children}
      {!!description &&
        <div className="Field-description m-1 text-[14px] leading-[20px] text-textSec2">{description}</div>
      }
    </div>
  )
}
