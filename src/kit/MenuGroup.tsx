import cx from 'classnames'
import type { ReactNode } from 'react'

const MenuGroup = ({ className, children }: {
  className?: string,
  children: ReactNode,
}) => {
  return (
    <div className={cx('MenuGroup rounded-[12px] bg-bg overflow-hidden', className)}>
      {children}
    </div>
  )
}

export default MenuGroup
