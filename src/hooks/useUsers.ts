import { useStore } from '../store'
import type { TUser, TUserId, TShare } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectPersonId } = useStore()

  const usedUserIds = transaction.shares.map(share => share.related_user_id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user.id))

  const isRelationsComplete = transaction.shares.every(share => share.related_user_id)

  const getUserById = (userId: TUserId) => {
    return users.find(user => user.id === userId)
  }

  const selectUser = (user: TUser) => () => {
    if (selectPersonId !== null) { // change user
      const updShares: TShare[] = [...transaction.shares]
      const doubledUserIndex = updShares.findIndex(share => share.related_user_id === user.id)
      // set user
      for (let i = 0; i < updShares.length; i++) {
        if (updShares[i].person_id === selectPersonId) {
          updShares[i].related_user_id = user.id
        }
      }
      // remove double only after setting
      if (~doubledUserIndex) {
        if (updShares[doubledUserIndex].normalized_name) {
          delete updShares[doubledUserIndex].related_user_id // todo: check
        } else {
          updShares.splice(doubledUserIndex, 1)
        }
      }
      setTransaction({
        ...transaction,
        shares: updShares
      })
    } else { // add user
      const updShares: TShare[] = [
        ...transaction.shares,
        {
          person_id: `Person-added-${Math.round(Math.random() * 1e10)}`, // todo: check
          is_payer: false,
          amount: 0,
          related_user_id: user.id
        }
      ]
      setTransaction({
        ...transaction,
        shares: updShares
      })
    }
    history.back()
  }

  const deleteUser = (personId: string) => () => {
    const updShares = [...transaction.shares].filter(share => share.person_id !== personId)
    setTransaction({
      ...transaction,
      shares: updShares
    })
    history.back()
  }

  return { users, unrelatedUsers, isRelationsComplete, getUserById, selectUser, deleteUser }
}
