import { useSplash } from '../hooks'

import { Loader, Overlay } from '../kit'

export const OverlaySplash = () => {
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
