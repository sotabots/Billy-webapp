import cx from 'classnames'
import { ReactNode, useMemo, useEffect } from 'react'

import { useStore } from '../store'

type TProps = {
  isOpen: boolean,
  isCenter?: boolean,
  children: ReactNode,
}

function Overlay({ isOpen, isCenter, children }: TProps) {
  const { overlays, setOverlays } = useStore()
  const overlay = useMemo(() => Math.round(Math.random() * 1e10), [])

  useEffect(() => {
    if (isOpen) {
      setOverlays([...overlays, overlay])
    } else {
      setOverlays(overlays.filter(_ => _ != overlay))
    }
  }, [isOpen])

  return (
    <div className={cx(
      'Overlay fixed top-0 left-0 w-full h-full overflow-y-auto bg-bg2 transition-all',
      isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}>
      <div className={cx(isCenter && 'flex items-center justify-center w-full min-h-full text-center')}>
        {children}
      </div>
    </div>
  )
}

export default Overlay
