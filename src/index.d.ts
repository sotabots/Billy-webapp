import type { InitDataUnsafe, ThemeParams } from '@vkruglikov/react-telegram-web-app'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string
        initDataUnsafe: InitDataUnsafe
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        themeParams: ThemeParams
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor: string
        backgroundColor: string
        isClosingConfirmationEnabled: boolean
        close: VoidFunction
        SettingsButton?: {
          show: VoidFunction
          onClick: (callback: VoidFunction) => void
          offClick: (offClick: VoidFunction) => void
        }
        // ...and more
        // see https://core.telegram.org/bots/webapps#initializing-mini-apps
      }
    }
  }
}
