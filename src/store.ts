import { create } from 'zustand'

import { currencies } from './data'
import { TUser, TUserRelation, TCurrency, TData } from './types'

import { generateUserAmount, generateUserRelation, generateUser } from './data'

type TStore = {
  users: TUser[]
  setUsers: (users: TUser[]) => void
  userRelations: TUserRelation[]
  setUserRelations: (userRelations: TUserRelation[]) => void
  currency: TCurrency
  setCurrency: (currency: TCurrency) => void
  data: TData,
  setData: (data: TData) => void
}

const useStore = create<TStore>((set) => ({
  users: [
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
  ],
  setUsers: (users) => set(({ users })),
  userRelations: [
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation()
  ],
  setUserRelations: (userRelations) => set(({ userRelations })),
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
