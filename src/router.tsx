import { createHashRouter } from 'react-router-dom'

import { SelectUser, Edit, SelectCurrency, SelectUsers, SelectCategory, Home, Onboarding, Soon, Paywall, Profile, UserSettings, PayoffMethods } from './pages'

export const router = createHashRouter([
  {
    path: '/',
    element: <Edit />,
    errorElement: <Edit />,
  },
  {
    path: '*',
    element: <Edit />,
  },
  {
    path: '/summary',
    element: <Home tab="summary" />,
  },
  {
    path: '/user-balance',
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
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/user-settings',
    element: <UserSettings />,
  },
  {
    path: '/payoff-methods',
    element: <PayoffMethods page="all" />,
  },
  {
    path: '/payoff-methods/add',
    element: <PayoffMethods page="add" />,
  },
  {
    path: '/payoff-methods/edit',
    element: <PayoffMethods page="edit" />,
  },
])
