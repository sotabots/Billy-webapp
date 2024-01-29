import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { RouterProvider } from 'react-router-dom'

import { useAutoExpand, useTheme } from './hooks'

import './i18n';
import { router } from './router'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import SplashScreen from './kit/SplashScreen'
import DemoMode from './kit/DemoMode'

const queryClient = new QueryClient()

function App() {
  useTheme()
  useAutoExpand()

  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <SplashScreen />
        <DemoMode />
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
