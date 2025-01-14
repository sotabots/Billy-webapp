import { useGetSummary } from '../hooks'
import { TDebt } from '../types'

export const useSummary = () => {
  const { data: summary } = useGetSummary()

  const debts: TDebt[] = [
    ...(summary?.balance.debt.details || []),
    ...(summary?.balance.credit.details || [])
  ]

  const debtCurrencyIds = !debts
    ? []
    : [...(new Set(debts.map(debt => debt.value_primary.currency_id)))]

  return { debtCurrencyIds, debts }
}