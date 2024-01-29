import { useStore } from '../store'
import type { TCurrencyId } from '../types'

export const useCurrencies = () => {
  const { currencies } = useStore()

  const getCurrencyById = (id: TCurrencyId) =>
    currencies.find(currency => currency._id === id)

  return { getCurrencyById }
}
