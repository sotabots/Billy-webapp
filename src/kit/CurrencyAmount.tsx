import cx from 'classnames'

import { useCurrencies } from '../hooks'
import { TCurrencyAmount } from '../types'
import { formatAmount } from '../utils'

export const CurrencyAmount = ({ className, currencyAmount, convertedAmount, noColor, isSign }: {
  className?: string
  currencyAmount: TCurrencyAmount
  convertedAmount?: TCurrencyAmount
  noColor?: boolean
  isSign?: boolean
}) => {
  const { getCurrencyById } = useCurrencies()

  const currency = getCurrencyById(currencyAmount.currency_id)
  const convertedCurrency = getCurrencyById(convertedAmount?.currency_id || null)

  if (!currency) {
    return null
  }

  return (
    <div className={cx(
      'CurrencyAmount flex items-center',
      className,
    )}>
      <div className={cx(
        'font-semibold',
        !noColor && 'text-textSec2',
        currencyAmount.amount > 0 && !noColor && '!text-green',
        currencyAmount.amount < 0 && !noColor && '!text-red',
      )}>
        {`${(currencyAmount.amount < 0 && isSign) ? '−' : ''}${formatAmount(Math.abs(currencyAmount.amount))}${currency.symbol}`}
      </div>
      {!!convertedAmount && convertedAmount.currency_id !== currencyAmount.currency_id && !!convertedCurrency &&
        <div className="flex items-center text-textSec">
          <div> ≃ </div>
          <div className={cx(
          )}>
            {`${(convertedAmount.amount < 0 && isSign) ? '−' : ''}${formatAmount(Math.abs(convertedAmount.amount))}${convertedCurrency.symbol}`}
          </div>
        </div>
      }
    </div>
  )
}
