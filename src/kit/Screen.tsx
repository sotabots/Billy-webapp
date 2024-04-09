import cx from 'classnames'
import { ReactNode } from 'react'

import Debug from './Debug'
import Limiter from './Limiter'

type TScreen = {
  children: ReactNode,
  className?: string,
  _ref?: React.RefObject<HTMLDivElement>
}

function Screen({ children, className, _ref }: TScreen) {
  return (
    <div
      className={cx('Screen fixed top-0 left-0 w-full h-full overflow-y-auto text-text bg-bg2', className)}
      ref={_ref}
    >
      <Limiter>
        {children}
        <Debug />
      </Limiter>
    </div>
  )
}

export default Screen
