import { /*decimals,*/ visible_decimals } from './const'

// export const formatAmount = (amount: number) => (amount / 10 ** decimals).toFixed(visible_decimals)
export const formatAmount = (amount: number) => amount.toFixed(visible_decimals)

// export const unformatAmount = (string: string) => (parseFloat(string) * 10 ** decimals) || 0
export const unformatAmount = (string: string) => parseFloat(string) || 0