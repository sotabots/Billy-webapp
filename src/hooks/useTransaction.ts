import { decimals } from '../const'
import { useAuth, useStore } from './'
import { TShare, TTransaction } from '../types'
import { formatAmount } from '../utils'

export const useTransaction = () => {
  const { transaction } = useStore()

  const payedShares = (transaction?.shares || []).filter(share => share.is_payer)
  const oweShares = (transaction?.shares || []).filter(share => !share.is_payer)

  const payedSum = payedShares.reduce((acc, item) => acc + item.amount, 0)
  const payedSumFormatted = formatAmount(payedSum)
  const oweSum = oweShares.reduce((acc, item) => acc + item.amount, 0)
  const oweSumFormatted = formatAmount(oweSum)

  const fromDecimals = (n: number) => Math.round(n * 10**decimals)

  const TOLERANCE = 0.01
  const isLacks = fromDecimals(oweSum) - fromDecimals(payedSum) >= fromDecimals(TOLERANCE)
  const isOverdo = fromDecimals(payedSum) - fromDecimals(oweSum) >= fromDecimals(TOLERANCE)
  const isBalanced = !isLacks && !isOverdo
  const isWrongAmounts = !isBalanced || !(payedSum > 0) || !(oweSum > 0)

  const isEmptyTx = !transaction?.formatted_text && !transaction?.raw_text

  // deduplicate by person_id
  const deduplicatedShares = (transaction?.shares || []).reduce((acc, share) => {
    const prevPersonIds = acc.map(acc => acc.person_id)
    return share.person_id !== null && prevPersonIds.includes(share.person_id) ? acc : [...acc, share]
  }, [] as TShare[])

  const { userId } = useAuth()

  const getUserBalanceDelta = (tx: TTransaction, targetUserId: number | null | undefined) => {
    if (!targetUserId) return 0
    const shares: TShare[] = tx.shares.filter(share => share.related_user_id === targetUserId)
    return shares.reduce((acc, share) => acc + share.amount * (share.is_payer ? 1 : -1), 0)
  }

  const getMyBalanceDelta = (tx: TTransaction) => {
    return getUserBalanceDelta(tx, userId)
  }

  return { transaction, payedShares, oweShares, payedSum, payedSumFormatted, oweSum, oweSumFormatted, isWrongAmounts, isEmptyTx, deduplicatedShares, getMyBalanceDelta, getUserBalanceDelta }
}