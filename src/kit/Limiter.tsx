import cx from 'classnames'
import type { ReactNode } from 'react'

export const Limiter = ({ className, children }: {
  className?: string,
  children: ReactNode,
}) => (
  <div className={cx('Limiter mx-auto max-w-[768px]', className)}>
    {children}
  </div>
)
