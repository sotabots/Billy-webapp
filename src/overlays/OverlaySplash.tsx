import { useSplash } from '../hooks'

import Loader from '../kit/Loader'
import Overlay from '../kit/Overlay'

function OverlaySplash() {
  const { isLoading } = useSplash()

  if (location.href.includes('onboarding')) {
    return null
  }

  return (
    <Overlay isOpen={isLoading} isCenter>
      <Loader size={50} />
    </Overlay>
  )
}

export default OverlaySplash
