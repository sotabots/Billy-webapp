import { createHashRouter } from 'react-router-dom'

import { SelectUser, Check, SelectCurrency, SelectUsers, SelectCategory, Home, Onboarding, Soon, Paywall, Me } from './pages'

export const router = createHashRouter([
  {
    path: '/',
    element: <Check />,
    errorElement: <Check />,
  },
  {
    path: '*',
    element: <Check />,
  },
  {
    path: '/summary',
    element: <Home tab="summary" />,
  },
  {
    path: '/balance',
    element: <Home tab="balance" />,
  },
  {
    path: '/settings',
    element: <Home tab="settings" />,
  },
  {
    path: '/select-user',
    element: <SelectUser />,
  },
  {
    path: '/select-currency',
    element: <SelectCurrency />,
  },
  {
    path: '/select-users',
    element: <SelectUsers />,
  },
  {
    path: '/select-category',
    element: <SelectCategory />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/onboarding-end',
    element: <Onboarding isEnd />,
  },
  {
    path: '/soon',
    element: <Soon />,
  },
  {
    path: '/paywall',
    element: <Paywall />,
  },
  {
    path: '/me',
    element: <Me />,
  },
])
