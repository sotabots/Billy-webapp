import { useStore } from '../store'
import type { TUser, TUserId, TShare } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectPersonId } = useStore()

  const transactionShares = transaction?.shares || [] as TShare[]

  const usedUserIds = transactionShares.map(share => share.related_user_id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user._id))

  const isRelationsComplete = transactionShares.length > 1 && transactionShares.every(share =>
      share.related_user_id &&
      users.find(user => user._id === share.related_user_id)
    )

  const getUserById = (userId: TUserId) => {
    return users.find(user => user._id === userId)
  }

  const selectUser = (user: TUser) => () => {
    if (selectPersonId !== null) { // change user
      const updShares: TShare[] = [...transactionShares]
      const doubledUserIndex = updShares.findIndex(share => share.related_user_id === user._id)
      // set user
      for (let i = 0; i < updShares.length; i++) {
        if (updShares[i].person_id === selectPersonId) {
          updShares[i].related_user_id = user._id
        }
      }
      // remove double only after setting
      if (~doubledUserIndex) {
        if (updShares[doubledUserIndex].normalized_name) {
          // delete updShares[doubledUserIndex].related_user_id // todo: check
          updShares[doubledUserIndex].related_user_id = null // todo: check
        } else {
          updShares.splice(doubledUserIndex, 1)
        }
      }
      if (transaction) {
        setTransaction({
          ...transaction,
          shares: updShares
        })
      }
    } else { // add user
      const updShares: TShare[] = [
        ...transactionShares,
        {
          person_id: `Person-added-${Math.round(Math.random() * 1e10)}`, // todo: check
          is_payer: false,
          amount: 0,
          related_user_id: user._id
        }
      ]
      if (transaction) {
        setTransaction({
          ...transaction,
          shares: updShares
        })
      }
    }
    history.back()
  }

  const deleteUser = (personId: string) => () => {
    const updShares = [...transactionShares].filter(share => share.person_id !== personId)
    if (transaction) {
      setTransaction({
        ...transaction,
        shares: updShares
      })
    }
    history.back()
  }

  return { users, unrelatedUsers, isRelationsComplete, getUserById, selectUser, deleteUser }
}
