import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'
import type { TUser, TUserId, TShare } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectPersonId } = useStore()
  const [impactOccurred, , selectionChanged] = useHapticFeedback()

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
      const doubledUserIndexes: number[] = []
      for (let i = 0; i < updShares.length; i++) {
        if (updShares[i].person_id === selectPersonId) {
          // set user
          updShares[i].related_user_id = user._id
        } else {
          // fill doubles
          if (updShares[i].related_user_id === user._id) {
            doubledUserIndexes.push(i)
          }
        }
      }
      // remove doubles only after setting
      for (const doubledUserIndex of doubledUserIndexes.reverse()) {
        if (updShares[doubledUserIndex].normalized_name) {
          // remove initially existing
          updShares[doubledUserIndex].related_user_id = null
        } else {
          // remove added
          updShares.splice(doubledUserIndex, 1)
        }
      }
      if (transaction) {
        setTransaction({
          ...transaction,
          shares: updShares
        })
      }
    }
    console.log('selectUser vibro')
    selectionChanged()
    impactOccurred('light')
    history.back()
  }

  const addUsers = (users: TUser[]) => () => {
    if (selectPersonId === null) { // add user
      const updShares: TShare[] = [
        ...transactionShares,
        ...users.map(user => (
          {
            person_id: `added-person-user-${user._id}`, // todo: check
            raw_name: null, //user.first_name,
            normalized_name: null, // user.first_name,
            is_payer: false,
            amount: 0,
            user_candidates: null,
            related_user_id: user._id
          }
        ))
      ]
      if (transaction) {
        setTransaction({
          ...transaction,
          shares: updShares
        })
      }
    }
    console.log('selectUser vibro')
    selectionChanged()
    impactOccurred('light')
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
    // console.log('deleteUser vibro')
    // impactOccurred('rigid')
    history.back()
  }

  return { users, unrelatedUsers, isRelationsComplete, getUserById, addUsers, selectUser, deleteUser }
}
