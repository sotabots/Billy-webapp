import { useGetCurrencies } from '../hooks'
import type { TCurrencyId } from '../types'

export const useCurrencies = () => {
  const { data: currencies } = useGetCurrencies()

  const getCurrencyById = (id: TCurrencyId | null) =>
    (currencies || []).find(currency => currency._id === id)

  return { getCurrencyById }
}
