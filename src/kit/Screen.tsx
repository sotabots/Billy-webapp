import cx from 'classnames'
import { ReactNode } from 'react'

import Debug from './Debug'
import Limiter from './Limiter'

type TScreen = {
  children: ReactNode,
  className?: string
}

function Screen({ children, className }: TScreen) {
  return (
    <div className={cx('Screen fixed top-0 left-0 w-full h-full overflow-y-auto text-text bg-bg2', className)}>
      <Limiter>
        {children}
        <Debug />
      </Limiter>
    </div>
  )
}

export default Screen
