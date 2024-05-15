import { useEffect, useState } from 'react'

import { useSplash, useFeedback } from '../hooks'

import Loader from '../kit/Loader'
import Overlay from '../kit/Overlay'

function OverlaySplash() {
  const { isLoading } = useSplash()
  const { feedback } = useFeedback()

  const [isSended, setSended] = useState(false)

  useEffect(() => {
    if (!isLoading && !isSended) {
      feedback('open_app_web')
      setSended(true)
    }
  }, [isLoading, isSended, setSended])

  return (
    <Overlay isOpen={isLoading} isCenter>
      <Loader size={50} />
    </Overlay>
  )
}

export default OverlaySplash
