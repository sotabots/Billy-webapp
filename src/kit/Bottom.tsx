// import cx from 'classnames'
import type { ReactNode } from 'react'

import { Limiter } from '../kit'

export const Bottom =({ /*className,*/ children, h }: {
  // className?: string
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
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        />
      </div>
      <div className="Bottom-content fixed w-full px-4 bottom-0 left-0 bg-bg2 py-2">
        <div className="Bottom-content-shadow absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg2" />
        <Limiter>
          {children}
        </Limiter>
        <div
          className="Bottom-content-safearea"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        />
      </div>
    </>
  )
}
