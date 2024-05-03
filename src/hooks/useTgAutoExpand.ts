import { useEffect } from 'react'

import { useExpand } from '@vkruglikov/react-telegram-web-app'

export const useTgAutoExpand = () => {
  const [isExpanded, expand] = useExpand()
  useEffect(() => {
    if (!isExpanded) {
      expand()
    }
  }, [])
}
