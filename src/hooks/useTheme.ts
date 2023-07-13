import { useState } from 'react'

export const useTheme = () => {
  const isPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isPrefersDark())

  const listener = () => {
    setIsDarkTheme(isPrefersDark())
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener)

  return { isDarkTheme }
}
