import { decimals, visible_decimals } from './api/mock'

export const formatAmount = (amount: number) => (amount / 10 ** decimals).toFixed(visible_decimals)

export const unformatAmount = (string: string) => (parseFloat(string) * 10 ** decimals) || 0
