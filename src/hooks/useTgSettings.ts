// import { useWebApp } from '@vkruglikov/react-telegram-web-app'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useTgSettings = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.Telegram?.WebApp.SettingsButton?.show()
    const goSettings = () => {
      navigate('/settings')
    }
    window.Telegram?.WebApp.SettingsButton?.onClick(goSettings)
    return () => { window.Telegram?.WebApp.SettingsButton?.offClick(goSettings) }
  }, [])
}
