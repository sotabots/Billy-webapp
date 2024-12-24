import cx from 'classnames'
import type { ReactNode } from 'react'

import { Limiter } from '../kit'

export const Bottom =({ className, children, h }: {
  className?: string
  children: ReactNode
  h: number
}) => {
  return (
    <>
      <div className="Bottom-spacer py-2">
        <div
          className="Bottom-spacer-content"
          style={{
            height: h,
          }}
        />
        <div
          className="Bottom-spacer-safearea"
          style={{
            paddingBottom: 'var(--tg-safe-area-inset-bottom)'
          }}
        />
      </div>
      <div className={cx(
        'Bottom-content fixed w-full px-4 bottom-0 left-0 bg-bg py-2',
        className,
      )}>
        <div className="Bottom-content-shadow absolute bottom-full left-0 w-full h-2 -bg-gradient-to-t from-bg to-transparent" />
        <Limiter className="w-full">
          <div className={cx('Bottom-content w-full', className)}>
            {children}
          </div>
        </Limiter>
        <div
          className="Bottom-content-safearea"
          style={{
            paddingBottom: 'var(--tg-safe-area-inset-bottom)'
          }}
        />
      </div>
    </>
  )
}
