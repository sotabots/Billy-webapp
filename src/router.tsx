import { createHashRouter } from 'react-router-dom'

import Match from './pages/Match'
import SelectUser from './pages/SelectUser'
import Check from './pages/Check'
import SelectCurrency from './pages/SelectCurrency'
import SelectUsers from './pages/SelectUsers'
import SummaryBalance from './pages/SummaryBalance'
import Settings from './pages/Settings'
import Soon from './pages/Soon'

export const router = createHashRouter([
  {
    path: "/",
    element: <Match />,
    errorElement: <Match />,
  },
  {
    path: "*",
    element: <Match />,
  },
  {
    path: "/select-user",
    element: <SelectUser />,
  },
  {
    path: "/check",
    element: <Check />,
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
    path: "/soon",
    element: <Soon />,
  },
])
