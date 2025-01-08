import cx from 'classnames'

import { useCurrencies } from '../hooks'
import { TCurrencyAmount } from '../types'
import { formatAmount } from '../utils'

export const CurrencyAmount = ({ className, noColor, currencyAmount }: {
  className?: string
  noColor?: boolean
  currencyAmount: TCurrencyAmount
}) => {
  const { getCurrencyById } = useCurrencies()

  const currency = getCurrencyById(currencyAmount.currency_id)

  if (!currency) {
    return null
  }

  return (
    <div className={cx(
      'CurrencyAmount font-semibold',
      !noColor && 'text-textSec2',
      currencyAmount.amount > 0 && !noColor && '!text-green',
      currencyAmount.amount < 0 && !noColor && '!text-red',
      className,
    )}>
      {`${currencyAmount.amount < 0 ? '−' : ''}${formatAmount(Math.abs(currencyAmount.amount))}${currency.symbol}`}
    </div>
  )
}
