import { useState } from 'react'

import { useThemeParams } from '@vkruglikov/react-telegram-web-app'


export const useTheme = () => {
  const [colorScheme/*, themeParams*/] = useThemeParams()
  const updIsDark = () => {
    const isDark = window.Telegram?.WebApp.colorScheme === 'dark'
    || colorScheme === 'dark'
    || window.matchMedia('(prefers-color-scheme: dark)').matches

    const darkClasses = ['theme-dark', 'dark']
    const lightClasses = ['theme-light', 'light']
    document.body.classList.add(...(isDark ? darkClasses : lightClasses))
    document.body.classList.remove(...(isDark ? lightClasses : darkClasses))

    return isDark
  }

  const [isDark, setIsDark] = useState<boolean>(updIsDark())

  const listener = () => {
    setIsDark(updIsDark())
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)

  return { isDark }
}
