import cx from 'classnames'
import { ReactNode } from 'react'

type TProps = {
  isOpen: boolean
  children: ReactNode,
}

function Overlay ({ isOpen, children }: TProps) {
  return (
    <div className={cx(
      'Overlay fixed top-0 left-0 w-full h-full overflow-y-auto bg-bg2 transition-all',
      isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}>
      {children}
    </div>
  )
}

export default Overlay
