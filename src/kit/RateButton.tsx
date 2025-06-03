import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './Button'
import { TCurrency, TLanguageCode } from '../types'
import { formatAmount } from '../utils'

export const RateButton = ({ className, currency, rate }: {
  className?: string
  currency: TCurrency
  rate: number
}) => {
  const { i18n } = useTranslation()
  const [isReverse, setIsReverse] = useState(false)

  return (
    <Button
      wrapperClassName="RateButton"
      className={cx(
        'w-full flex items-center justify-between gap-4 p-4',
        className,
      )}
      onClick={() => { setIsReverse(!isReverse) }}
    >
      <div className="">
        {currency.title[i18n.language as TLanguageCode]}
      </div>
      <div className="">
        <span>1 {!isReverse ? '$' : currency.symbol}</span>
        <span> ≈ </span>
        <span className="font-semibold">
          {!rate ? 0 :
            !isReverse ? rate : formatAmount(1 / rate, 6)
          }
          {' '}
          {!isReverse ? currency.symbol : '$'}
        </span>
      </div>
    </Button>
  )
}
