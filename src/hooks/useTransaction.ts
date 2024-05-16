import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'

import { TShare, TTransaction } from '../types'

export const useTransaction = () => {
  const { transaction } = useStore()

  const isEmptyTx = !transaction?.formatted_text && !transaction?.raw_text

  // deduplicate by person_id
  const deduplicatedShares = (transaction?.shares || []).reduce((acc, share) => {
    const prevPersonIds = acc.map(acc => acc.person_id)
    return share.person_id !== null && prevPersonIds.includes(share.person_id) ? acc : [...acc, share]
  }, [] as TShare[])

  const [initDataUnsafe] = useInitData()
  const getMyBalanceDelta = (tx: TTransaction) => {
    const myShares: TShare[] = tx.shares.filter(share => share.related_user_id === initDataUnsafe.user?.id)
    const myBalanceDelta: number = myShares.reduce((acc, share) =>
      acc + share.amount * (share.is_payer ? 1 : -1)
    , 0)
    return myBalanceDelta
  }

  return { transaction, isEmptyTx, deduplicatedShares, getMyBalanceDelta }
}