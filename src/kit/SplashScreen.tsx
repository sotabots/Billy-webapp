import cx from 'classnames'
import { useState, useEffect } from 'react'

function SplashScreen() {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 1500)
  }, [])

  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full bg-bg2 transition-all',
      isLoaded ? 'pointer-events-none opacity-0' : 'opacity-100'
    )}>
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[50px] h-[50px]">
        <div className="w-full h-full rounded-full border-[3px] border-button border-l-button/10 border-t-button/10 animate-[spin_0.6s_linear_infinite]" />
      </div>
    </div>
  )
}

export default SplashScreen
