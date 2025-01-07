import { useTranslation } from 'react-i18next'

import { Button, User } from '../kit'
import { useUsers, useCurrencies, useAuth } from '../hooks'
import { TDebt, TUser } from '../types'
import { formatAmount } from '../utils'

import { ReactComponent as ToIcon } from '../assets/to.svg'

type TDebtProps = TDebt & {
  onClick: () => void
}

export const Debt2 = ({ from_user_id, to_user_id, amount, currency_id, onClick }: TDebtProps) => {
  const { t } = useTranslation()

  const { getUserById } = useUsers()

  const fromUser = getUserById(from_user_id)
  const toUser = getUserById(to_user_id)

  const { getCurrencyById } = useCurrencies()
  const chatCurrency = getCurrencyById(currency_id)

  const { userId } = useAuth()
  const user: TUser | undefined =
    userId === from_user_id ? fromUser :
    userId === to_user_id ? toUser :
    undefined

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="Debt2 flex gap-3 items-center">
      <div className="mt-1 flex gap-1 items-center">
        <div className="flex items-center">
          <div className="w-[14px] h-[14px] -mt-[1px] mr-[1px]">
            <ToIcon />
          </div>
          <div className="text-[14px] leading-[24px] font-semibold">{formatAmount(amount)}{chatCurrency?.symbol}</div>
        </div>
        <User
          user={user}
          size={24}
          secondRow={false}
          className="gap-[2px] !text-[14px] !leading-[20px] text-textSec"
        />
      </div>

      <Button
        theme="settleUp"
        onClick={onClick}
      >
        {t('settleUp')}
      </Button>
    </div>
  )
}
