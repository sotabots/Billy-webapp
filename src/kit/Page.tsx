import cx from 'classnames'
import { ReactNode, UIEvent } from 'react'
import { ScrollRestoration } from 'react-router-dom'

import { Debug, Limiter } from '../kit'

export const Page = ({ className, children, _ref, onScroll }: {
  className?: string
  children: ReactNode
  _ref?: React.RefObject<HTMLDivElement>
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}) => {
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
      <ScrollRestoration />
    </div>
  )
}
