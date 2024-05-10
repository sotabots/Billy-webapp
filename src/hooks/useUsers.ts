import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'
import type { TUser, TUserId, TShare } from '../types'

export const useUsers = () => {
  const { users, transaction, setTransaction, selectPersonId } = useStore()
  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const transactionShares = transaction?.shares || [] as TShare[]

  const usedUserIds = transactionShares.map(share => share.related_user_id)
  const unrelatedUsers = users.filter(user => !usedUserIds.includes(user._id))

  const countUnrelatedPersons = [...new Set(
    transactionShares.filter(share =>
      !(
        share.related_user_id &&
        users.find(user => user._id === share.related_user_id)
      )
    ).map(share => share.person_id)
  )].length
  const isRelationsComplete = countUnrelatedPersons === 0
  // todo: improve (???)
  const isRelationsEnough = transactionShares.length > 1

  const getUserById = (userId: TUserId) => {
    return users.find(user => user._id === userId)
  }

  const selectUser = (user: TUser) => {
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

  const addUsers = (users: TUser[], { isAuthor = false }: { isAuthor?: boolean } = {}) => {
    if (selectPersonId === null && transaction) { // add user
      const wasPayers = transactionShares.some(share => share.is_payer)

      const shareFromUser = ({ isPayer }: {
        isPayer: boolean
      }) =>
        (user: TUser): TShare => ({
          person_id: isAuthor ? 'MESSAGE_AUTHOR' : `added-person-user-${user._id}`,
          raw_name: null,
          normalized_name: isAuthor ? 'MESSAGE_AUTHOR' : null,
          is_payer: isPayer,
          amount: 0,
          related_user_id: user._id,
          is_fixed_amount: false,
        })

      const updShares: TShare[] = [
        ...transactionShares,
        ...(wasPayers ? [] : [shareFromUser({ isPayer: true })(users[0])]),
        ...users.map(shareFromUser({ isPayer: false }))
      ]
      setTransaction({
        ...transaction,
        shares: updShares
      })
    }
    // todo: move out
    console.log('addUsers vibro')
    selectionChanged()
    impactOccurred('light')
    history.back()
  }

  const updUsers = (userIds: TUserId[], isPayer: null | boolean) => {
    console.log('updUsers', users)
    if (isPayer !== null) {
      const updSharesFiltered: TShare[] = [
        ...transactionShares
      ].filter(share => !(
        share.is_payer === isPayer &&
        share.related_user_id !== null &&
        !userIds.includes(share.related_user_id)
      ))

      const addingUserIds = userIds.filter(userId =>
        !transactionShares.find(share => (
          share.is_payer === isPayer &&
          share.related_user_id !== null &&
          userId === share.related_user_id
        )
      ))

      const updShares: TShare[] = [
        ...updSharesFiltered,
        ...addingUserIds.map(userId => (
          {
            person_id: `added-person-user-${userId}`, // todo: check
            raw_name: null, //user.first_name,
            normalized_name: null, // user.first_name,
            is_payer: isPayer,
            amount: 0,
            related_user_id: userId,
            is_fixed_amount: false,
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

    console.log('updUsers vibro')
    selectionChanged()
    impactOccurred('light')
    history.back()
  }

  const deleteUser = (personId: string) => {
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

  return { users, unrelatedUsers, countUnrelatedPersons, isRelationsComplete, isRelationsEnough, getUserById, selectUser, addUsers, updUsers, deleteUser }
}
