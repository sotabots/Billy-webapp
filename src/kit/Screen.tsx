import cx from 'classnames'
import { ReactNode, UIEvent } from 'react'

import Debug from './Debug'
import Limiter from './Limiter'

type TScreen = {
  children: ReactNode,
  className?: string,
  _ref?: React.RefObject<HTMLDivElement>,
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}

function Screen({ children, className, _ref, onScroll }: TScreen) {
  return (
    <div
      className={cx('Screen fixed top-0 left-0 w-full h-full overflow-y-auto text-text bg-bg2', className)}
      ref={_ref}
      onScroll={onScroll}
    >
      <Limiter>
        {children}
        <Debug />
      </Limiter>
    </div>
  )
}

export default Screen
