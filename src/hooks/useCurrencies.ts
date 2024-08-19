import { useStore } from './'
import type { TCurrencyId } from '../types'

export const useCurrencies = () => {
  const { currencies } = useStore()

  const getCurrencyById = (id: TCurrencyId | null) =>
    currencies.find(currency => currency._id === id)

  return { getCurrencyById }
}
