// import { useWebApp } from '@vkruglikov/react-telegram-web-app'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFeedback } from '.'

export const useTgSettings = () => {
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  useEffect(() => {
    window.Telegram?.WebApp.SettingsButton?.show()
    const goSettings = () => {
      feedback('open_settings_web')
      navigate('/settings')
    }
    window.Telegram?.WebApp.SettingsButton?.onClick(goSettings)
    return () => { window.Telegram?.WebApp.SettingsButton?.offClick(goSettings) }
  }, [])
}
