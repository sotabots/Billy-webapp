import { useStore } from '../store'
import type { TUser, TUserId, TShare } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectUserIndex } = useStore()

  const usedUserIds = transaction.shares.map(share => share.related_user_id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user.id))

  const isRelationsComplete = transaction.shares.every(share => share.related_user_id)

  const getUserById = (userId: TUserId) => {
    return users.find(user => user.id === userId)
  }

  const selectUser = (user: TUser) => () => {
    if (selectUserIndex !== null) { // change user
      const newShares: TShare[] = [...transaction.shares]
      const doubledUserIndex = newShares.findIndex(share => share.related_user_id === user.id)
      // set user
      newShares[selectUserIndex].related_user_id = user.id
      // remove double only after setting
      if (~doubledUserIndex) {
        if (newShares[doubledUserIndex].normalized_name) {
          delete newShares[doubledUserIndex].related_user_id // todo: check
        } else {
          newShares.splice(doubledUserIndex, 1)
        }
      }
      setTransaction({
        ...transaction,
        shares: newShares
      })
    } else { // add user
      const newShares: TShare[] = [
        ...transaction.shares,
        {
          is_payer: false,
          amount: 0,
          related_user_id: user.id
        }
      ]
      setTransaction({
        ...transaction,
        shares: newShares
      })
    }
    history.back()
  }

  const deleteUser = (userIndex: number) => () => {
    const newShares = [...transaction.shares]
    newShares.splice(userIndex, 1)
    setTransaction({
      ...transaction,
      shares: newShares
    })
    history.back()
  }

  return { users, unrelatedUsers, isRelationsComplete, getUserById, selectUser, deleteUser }
}
