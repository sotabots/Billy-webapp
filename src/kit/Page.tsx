import cx from 'classnames'
import { ReactNode, UIEvent } from 'react'

import Debug from './Debug'
import Limiter from './Limiter'

function Page({ className, children, _ref, onScroll }: {
  className?: string
  children: ReactNode
  _ref?: React.RefObject<HTMLDivElement>
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      className={cx('Page z-0 relative w-full min-h-[100vh] text-text bg-bg2', className)}
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

export default Page
