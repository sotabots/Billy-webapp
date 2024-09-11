import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { RouterProvider } from 'react-router-dom'

import { useTgAutoExpand, useTheme, useClarity } from './hooks'

import './i18n'
import { router } from './router'

import DemoMode from './kit/DemoMode'
import OverlaySplash from './overlays/OverlaySplash'
import OverlayError from './overlays/OverlayError'

const queryClient = new QueryClient()

function App() {
  useTheme()
  useTgAutoExpand()
  useClarity()

  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <DemoMode />
        <OverlaySplash />
        <OverlayError />
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
