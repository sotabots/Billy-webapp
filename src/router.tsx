import { createHashRouter } from 'react-router-dom'

import { SelectUser, Check, SelectCurrency, SelectUsers, SelectCategory, SummaryBalance, Settings, Onboarding, Soon, Paywall } from './pages'

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
    path: '/summary',
    element: <SummaryBalance tab="summary" />,
  },
  {
    path: '/balance',
    element: <SummaryBalance tab="balance" />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/soon',
    element: <Soon />,
  },
  {
    path: '/paywall',
    element: <Paywall />,
  },
])
