import { /*decimals,*/ visible_decimals } from './const'
import type { TCurrencyId, TPayFor, TRates, TUserId } from './types'

// export const formatAmount = (amount: number) => (amount / 10 ** decimals).toFixed(visible_decimals)
export const formatAmount = (amount: number, decimals: number = visible_decimals) => amount.toFixed(decimals)

// export const unformatAmount = (string: string) => (parseFloat(string) * 10 ** decimals) || 0
export const unformatAmount = (string: string) => parseFloat(string) || 0

export const DEFAULT_USD_RATE = 1.0

export const getUsdRate = (rates: TRates | undefined, currencyId: TCurrencyId | null | undefined): number => {
  if (!currencyId) {
    return DEFAULT_USD_RATE
  }

  const rate = rates?.[`USD${currencyId}`]
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0
    ? rate
    : DEFAULT_USD_RATE
}

export const getTransactionEditPath = (txId: string) => `/?${new URLSearchParams({ txid: txId }).toString()}`

export const encodeStartParam = (payload: Record<string, unknown>): string =>
  btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

export const getChatBalanceStartPath = (startParam: string) => (
  `/chat-balance?${new URLSearchParams({ start: startParam }).toString()}`
)

export const getChatBalanceStartUrl = (startParam: string): string => {
  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return `${baseUrl}#${getChatBalanceStartPath(startParam)}`
}

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
