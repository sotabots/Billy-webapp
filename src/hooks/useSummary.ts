import { useStore } from '../store'
import { TDebt } from '../types'

export const useSummary = () => {
  const { summary } = useStore()

  const debtCurrencyIds = !summary?.debts
    ? []
    : [...(new Set(summary.debts.map(item => item.currency_id)))]

  const debts: TDebt[] = summary?.debts || []

  return { debtCurrencyIds, debts }
}