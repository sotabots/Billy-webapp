import { useState } from 'react'

export const useTheme = () => {
  const isPrefersDark = () => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window?.Telegram?.Webapp?.colorScheme === 'dark'
    || window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isPrefersDark())

  const listener = () => {
    setIsDarkTheme(isPrefersDark())
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)

  return { isDarkTheme }
}
