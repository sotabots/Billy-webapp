import { createHashRouter } from 'react-router-dom'

import SelectUser from './pages/SelectUser'
import Check from './pages/Check'
import SelectCurrency from './pages/SelectCurrency'
import SelectUsers from './pages/SelectUsers'
import SelectCategory from './pages/SelectCategory'
import SummaryBalance from './pages/SummaryBalance'
import Settings from './pages/Settings'
import Onboarding from './pages/Onboarding'
import Soon from './pages/Soon'

export const router = createHashRouter([
  {
    path: "/",
    element: <Check />,
    errorElement: <Check />,
  },
  {
    path: "*",
    element: <Check />,
  },
  {
    path: "/select-user",
    element: <SelectUser />,
  },
  {
    path: "/select-currency",
    element: <SelectCurrency />,
  },
  {
    path: "/select-users",
    element: <SelectUsers />,
  },
  {
    path: "/select-category",
    element: <SelectCategory />,
  },
  {
    path: "/summary",
    element: <SummaryBalance tab="summary" />,
  },
  {
    path: "/balance",
    element: <SummaryBalance tab="balance" />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/soon",
    element: <Soon />,
  },
])
