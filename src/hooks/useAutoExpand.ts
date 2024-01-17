import { useEffect } from 'react'

import { useExpand } from '@vkruglikov/react-telegram-web-app'

export const useAutoExpand = () => {
  const [isExpanded, expand] = useExpand()
  useEffect(() => {
    if (!isExpanded) {
      expand()
    }
  }, [])
}
