import { create } from 'zustand'

import { currencies } from './data'
import { TCurrency } from './types'

type TStore = {
  currency: TCurrency
  setCurrency: (currency: TCurrency) => void
}

const useStore = create<TStore>((set) => ({
  currency: currencies[0],
  setCurrency: (currency) => set(({ currency })),
}))


export {
  useStore
}
