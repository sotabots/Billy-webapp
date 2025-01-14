import { useTranslation } from 'react-i18next'

import { Button, User } from '../kit'
import { useUsers, useCurrencies } from '../hooks'
import { TDebt } from '../types'
import { formatAmount } from '../utils'

import { ReactComponent as ToIcon } from '../assets/to.svg'

type TDebtProps = TDebt & {
  onClick: () => void
}

export const Debt = ({ from_user_id, to_user_id, value_primary, onClick }: TDebtProps) => {
  const { t } = useTranslation()

  const { getUserById } = useUsers()

  const fromUser = getUserById(from_user_id)
  const toUser = getUserById(to_user_id)

  const { getCurrencyById } = useCurrencies()
  const chatCurrency = getCurrencyById(value_primary.currency_id)

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="Debt flex gap-3 items-center">
      <User
        user={fromUser}
        size={48}
        secondRow={(
          <div className="mt-1 flex gap-1 items-center">
            <div className="flex items-center">
              <div className="w-[14px] h-[14px] -mt-[1px] mr-[1px]">
                <ToIcon />
              </div>
              <div className="text-[14px] leading-[24px] font-semibold">{formatAmount(value_primary.amount)}{chatCurrency?.symbol}</div>
            </div>
            <User
              user={toUser}
              size={24}
              secondRow={false}
              className="gap-[2px] !text-[14px] !leading-[20px] text-textSec"
            />
          </div>
        )}
      />

      <Button
        theme="settleUp"
        onClick={onClick}
      >
        {t('settleUp')}
      </Button>
    </div>
  )
}
