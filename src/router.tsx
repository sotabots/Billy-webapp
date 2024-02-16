import { createHashRouter } from 'react-router-dom'

import Start from './pages/Start'
import SelectUser from './pages/SelectUser'
import Check from './pages/Check'
import SelectCurrency from './pages/SelectCurrency'
import SelectUsers from './pages/SelectUsers'
import Summary from './pages/Summary'
import Paywall from './pages/Paywall'

export const router = createHashRouter([
  {
    path: "/",
    element: <Start />,
    errorElement: <Start />,
  },
  {
    path: "*",
    element: <Start />,
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
    element: <Summary />,
  },
  {
    path: "/paywall",
    element: <Paywall />,
  },
])
