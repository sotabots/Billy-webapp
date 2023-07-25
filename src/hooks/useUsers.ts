import { useStore } from '../store'
import { TUser } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectUserIndex } = useStore()

  const usedUserIds = transaction.map((item) => item.user?.id)
  const unrelatedUsers = users.filter(user => selectUserIndex !== null ? true : !usedUserIds.includes(user.id))

  const selectUser = (user: TUser) => () => {
    if (selectUserIndex !== null) { // change user
      const newTransaction = [...transaction]
      const doubledUserIndex = newTransaction.findIndex(part => part.user?.id === user.id)
      // set user
      newTransaction[selectUserIndex].user = user
      // remove double only after setting
      if (~doubledUserIndex) {
        if (newTransaction[doubledUserIndex].spokenName) {
          delete newTransaction[doubledUserIndex].user
        } else {
          newTransaction.splice(doubledUserIndex, 1)
        }
      }
      setTransaction(newTransaction)
    } else { // add user
      setTransaction([
        ...transaction,
        {
          isPayed: false,
          amount: 0,
          user
        }
      ])
    }
    history.back()
  }

  const isRelationsComplete = transaction.every(part => part.user)

  return { unrelatedUsers, selectUser, isRelationsComplete }
}
