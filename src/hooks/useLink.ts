import { useWebApp } from '@vkruglikov/react-telegram-web-app'

import { usePlatform } from '../hooks'

export const useLink = () => {
  const WebApp = useWebApp()
  const { isTg } = usePlatform()

  const isTgLink = (url: string) => {
    return url.startsWith('https://t.me/')
  }

  const openLink = (url: string) => {
    if (isTg) {
      if (isTgLink(url)) {
        WebApp.openTelegramLink(url)
      } else {
        WebApp.openLink(url)
      }
    } else {
      window.open(url, '_blank')?.focus()
    }
  }

  const ADD_TO_CHAT_LINK = 'https://t.me/BillyMoney_bot?startgroup=true&admin=pin_messages+delete_messages'

  return { isTgLink, openLink, ADD_TO_CHAT_LINK }
}
