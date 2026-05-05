// import { useWebApp } from '@vkruglikov/react-telegram-web-app'

import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useFeedback } from '.'

export const useTgSettings = () => {
  const routerLocation = useLocation()
  const navigate = useNavigate()
  const { feedback } = useFeedback()

  const goSettings = useCallback(() => {
    console.log('feedback from', routerLocation.pathname)
    feedback('open_settings_web', {
      from: {
        '/': 'total',
        '/select-user': 'expnames-select-user',
        '/select-currency': 'expshares-select-currency',
        '/select-users': 'expshares-select-users',
        '/select-category': 'expshares-select-category',
        '/summary': 'total',
        '/user-balance': 'balances',
        '/chat-balance': 'balances',
        '/soon': 'soon',
        // '': 'settleup', // maybe todo
      }[routerLocation.pathname] || 'expshares'
    })
    navigate('/user-settings')
  }, [feedback, navigate, routerLocation.pathname])

  useEffect(() => {
    if (routerLocation.pathname !== '/user-settings') {
      window.Telegram?.WebApp.SettingsButton?.show()
    } else {
      window.Telegram?.WebApp.SettingsButton?.hide()
    }

    window.Telegram?.WebApp.SettingsButton?.onClick(goSettings)
    return () => { window.Telegram?.WebApp.SettingsButton?.offClick(goSettings) }
  }, [goSettings, routerLocation.pathname])

  return { goSettings }
}
