import { useWebApp } from '@vkruglikov/react-telegram-web-app'

import { usePlatform } from '../hooks'

export const useOpenLink = () => {
  const WebApp = useWebApp()
  const { isTg } = usePlatform()

  const openLink = (url: string) => {
    if (isTg) {
      if (url.startsWith('https://t.me')) {
        WebApp.openTelegramLink(url)
      } else {
        WebApp.openLink(url)
      }
    } else {
      window.open(url, '_blank')?.focus()
    }
  }
  return { openLink }
}
