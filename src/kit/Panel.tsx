import cx from 'classnames'
import { ReactNode } from 'react'

type TPanel = {
  className?: string
  children: ReactNode,
}

export const Panel = ({ children, className }: TPanel) => {
  return (
    <div className={cx('Panel p-4 pb-6 rounded-3xl bg-bg', className)}>
      {children}
    </div>
  )
}
