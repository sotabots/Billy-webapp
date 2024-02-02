import cx from 'classnames'
import { ReactNode } from 'react'

const Limiter = ({ className, children }: {
  className?: string,
  children: ReactNode,
}) => (
  <div className={cx('Limiter mx-auto max-w-[800px]', className)}>
    {children}
  </div>
)

export default Limiter
