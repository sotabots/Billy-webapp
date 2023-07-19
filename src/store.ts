import { create } from 'zustand'

import { currencies } from './data'
import { TUserRelation, TCurrency, TData } from './types'

import { generateUserAmount, generateUserRelation } from './data'

type TStore = {
  userRelations: TUserRelation[]
  currency: TCurrency
  setCurrency: (currency: TCurrency) => void
  data: TData,
  setData: (data: TData) => void
}

const useStore = create<TStore>((set) => ({
  userRelations: [
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation()
  ],
  currency: currencies[0],
  setCurrency: (currency) => set(({ currency })),
  data: [
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: false }),
    generateUserAmount({ isPayed: false }),
  ],
  setData: (data) => set(({ data })),
}))


export {
  useStore
}
