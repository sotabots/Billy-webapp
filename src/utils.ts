import { /*decimals,*/ visible_decimals } from './const'
import type { TPayFor, TUserId } from './types'

// export const formatAmount = (amount: number) => (amount / 10 ** decimals).toFixed(visible_decimals)
export const formatAmount = (amount: number, decimals: number = visible_decimals) => amount.toFixed(decimals)

// export const unformatAmount = (string: string) => (parseFloat(string) * 10 ** decimals) || 0
export const unformatAmount = (string: string) => parseFloat(string) || 0


export const closeApp = () => {
  if (window.Telegram?.WebApp.platform !== 'unknown') {
    window.Telegram?.WebApp.close()
  } else {
    alert('Close webapp...')
  }
}

export const getPayerUserIdForPayee = (payFor: TPayFor | undefined, payeeUserId: TUserId | null | undefined): TUserId | null => {
  if (!payFor || !payeeUserId) return null

  for (const [payerUserIdRaw, payeeIdsRaw] of Object.entries(payFor as unknown as Record<string, unknown>)) {
    if (!Array.isArray(payeeIdsRaw)) continue

    const payeeIds = payeeIdsRaw
      .map(v => (typeof v === 'number' ? v : Number.parseInt(String(v), 10)))
      .filter(v => Number.isFinite(v)) as number[]

    if (!payeeIds.includes(payeeUserId)) continue

    const payerUserId = Number.parseInt(String(payerUserIdRaw), 10)
    if (!Number.isFinite(payerUserId)) return null

    return payerUserId as TUserId
  }

  return null
}
