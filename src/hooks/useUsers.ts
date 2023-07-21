import { useStore } from '../store'
import { TUser } from '../types'

export const useUsers = () => {
  const { users, userRelations, setUserRelations, selectUserIndex } = useStore()

  const usedUserIds = userRelations.map((item) => item.user?.id)
  const unrelatedUsers = users.filter(user => selectUserIndex !== null ? true : !usedUserIds.includes(user.id))

  const selectUser = (user: TUser) => () => {
    if (selectUserIndex !== null) { // change user
      const newUserRelations = [...userRelations]
      const doubledUserIndex = newUserRelations.findIndex(relation => relation.user?.id === user.id)
      // set user
      newUserRelations[selectUserIndex].user = user
      // remove double only after setting
      if (~doubledUserIndex) {
        if (newUserRelations[doubledUserIndex].title) {
          delete newUserRelations[doubledUserIndex].user
        } else {
          newUserRelations.splice(doubledUserIndex, 1)
        }
      }
      setUserRelations(newUserRelations)
    } else { // add user
      setUserRelations([
        ...userRelations,
        { user }
      ])
    }
    history.back()
  }

  const isRelationsComplete = userRelations.every(relation => relation.user)

  return { unrelatedUsers, selectUser, isRelationsComplete }
}
