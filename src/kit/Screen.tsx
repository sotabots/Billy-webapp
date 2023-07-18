import cx from 'classnames'
import { ReactNode } from 'react'

import Debug from './Debug'

type TScreen = {
  children: ReactNode,
  className?: string
}

function Screen({ children, className }: TScreen) {
  return (
    <div className={cx('fixed top-0 left-0 w-full h-full overflow-y-auto text-text bg-bg2', className)}>
      <div className="limiter">
        {children}
      </div>

      <Debug />
    </div>
  )
}

export default Screen
