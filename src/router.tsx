import { createHashRouter } from 'react-router-dom'

import Check from './pages/Check'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Start from './pages/Start'

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
])