import { useStore } from '../store'
import { TUser } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectUserIndex } = useStore()

  const usedUserIds = transaction.shares.map((item) => item.user?.id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user.id))

  const isRelationsComplete = transaction.shares.every(share => share.user)

  const selectUser = (user: TUser) => () => {
    if (selectUserIndex !== null) { // change user
      const newShares = [...transaction.shares]
      const doubledUserIndex = newShares.findIndex(share => share.user?.id === user.id)
      // set user
      newShares[selectUserIndex].user = user
      // remove double only after setting
      if (~doubledUserIndex) {
        if (newShares[doubledUserIndex].normalized_name) {
          delete newShares[doubledUserIndex].user
        } else {
          newShares.splice(doubledUserIndex, 1)
        }
      }
      setTransaction({
        ...transaction,
        shares: newShares
      })
    } else { // add user
      const newShares = [
        ...transaction.shares,
        {
          is_payer: false,
          amount: 0,
          user
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

  return { users, unrelatedUsers, isRelationsComplete, selectUser, deleteUser }
}
