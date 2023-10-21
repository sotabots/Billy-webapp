const decimals = 10 ** 4

export const formatAmount = (amount: number) => (amount / decimals).toFixed(2)

export const unformatAmount = (string: string) => (parseFloat(string) * decimals) || 0
