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
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10">
        <div className="w-full h-full rounded-full border-2 border-button border-l-transparent border-t-transparent animate-[spin_0.5s_linear_infinite]" />
      </div>
    </div>
  )
}

export default SplashScreen
