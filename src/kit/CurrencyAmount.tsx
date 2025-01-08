import cx from 'classnames'

import { useCurrencies } from '../hooks'
import { TCurrencyAmount } from '../types'
import { formatAmount } from '../utils'

export const CurrencyAmount = ({ className, currencyAmount }: {
  className?: string
  currencyAmount: TCurrencyAmount
}) => {
  const { getCurrencyById } = useCurrencies()

  const currency = getCurrencyById(currencyAmount.currency_id)

  if (!currency) {
    return null
  }

  return (
    <div className={cx(
      'CurrencyAmount text-textSec2 font-semibold',
      currencyAmount.amount > 0 && '!text-green',
      currencyAmount.amount < 0 && '!text-red',
      className,
    )}>
      {`${currencyAmount.amount < 0 ? '−' : ''}${formatAmount(Math.abs(currencyAmount.amount))}${currency.symbol}`}
    </div>
  )
}
