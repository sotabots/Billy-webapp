import { createHashRouter } from 'react-router-dom'

import Start from './pages/Start'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Check from './pages/Check'
import Summary from './pages/Summary'


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
    path: "/summary",
    element: <Summary />,
  },
])