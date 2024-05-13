import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { TShare, TTransaction } from '../types'

export const useTransaction = () => {
  const [initDataUnsafe] = useInitData()

  const getMyBalanceDelta = (tx: TTransaction) => {
    const myShares: TShare[] = tx.shares.filter(share => share.related_user_id === initDataUnsafe.user?.id)
    const myBalanceDelta: number = myShares.reduce((acc, share) =>
      acc + share.amount * (share.is_payer ? 1 : -1)
    , 0)
    return myBalanceDelta
  }

  return { getMyBalanceDelta }
}