import { useStore } from '../store'
import { TUser } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectUserIndex } = useStore()

  const usedUserIds = transaction.parts.map((item) => item.user?.id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user.id))

  const selectUser = (user: TUser) => () => {
    if (selectUserIndex !== null) { // change user
      const newParts = [...transaction.parts]
      const doubledUserIndex = newParts.findIndex(part => part.user?.id === user.id)
      // set user
      newParts[selectUserIndex].user = user
      // remove double only after setting
      if (~doubledUserIndex) {
        if (newParts[doubledUserIndex].spokenName) {
          delete newParts[doubledUserIndex].user
        } else {
          newParts.splice(doubledUserIndex, 1)
        }
      }
      setTransaction({
        ...transaction,
        parts: newParts
      })
    } else { // add user
      const newParts = [
        ...transaction.parts,
        {
          isPayed: false,
          amount: 0,
          user
        }
      ]
      setTransaction({
        ...transaction,
        parts: newParts
      })
    }
    history.back()
  }

  const isRelationsComplete = transaction.parts.every(part => part.user)

  return { users, unrelatedUsers, selectUser, isRelationsComplete }
}
