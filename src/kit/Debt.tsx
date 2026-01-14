import { useTranslation } from 'react-i18next'

import { Button, CurrencyAmount, User } from '../kit'
import { useUsers, /* useCurrencies, */ useAuth } from '../hooks'
import { TDebt, TUser, TUserId } from '../types'

import { ReactComponent as ToIcon } from '../assets/to.svg'

type TDebtProps = TDebt & {
  onClick: () => void
  contextUserId?: TUserId
}

export const Debt = ({ from_user_id, to_user_id, value_primary, value_secondary, onClick, contextUserId }: TDebtProps) => {
  const { t } = useTranslation()

  const { getUserById } = useUsers()

  const fromUser = getUserById(from_user_id)
  const toUser = getUserById(to_user_id)

  // const { getCurrencyById } = useCurrencies()
  // const chatCurrency = getCurrencyById(currency_id)

  const { userId } = useAuth()

  const viewUserId: null | TUserId = contextUserId ?? userId ?? null

  const user: TUser | undefined =
    viewUserId === from_user_id ? toUser :
    viewUserId === to_user_id ? fromUser :
    undefined

  if (!fromUser || !toUser || !user) {
    return null
  }

  return (
    <div className="Debt flex items-center justify-between gap-2 text-[14px] leading-[24px]">
      <div className="flex gap-1 items-center truncate">
        <div className="flex-nowrap w-[14px] h-[14px]">
          <ToIcon className={viewUserId === to_user_id ? '-rotate-90' : ''} />
        </div>
        <User
          className="gap-[2px] !text-[14px] !leading-[20px] -text-blue"
          user={user}
          size={24}
          secondRow={false}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <CurrencyAmount
          noColor
          currencyAmount={value_primary}
          convertedAmount={value_secondary}
        />
        <Button
          theme="settleUp2"
          onClick={
            (userId === to_user_id && !!false) // todo: remind
              ? () => {
                /* */
              }
              : onClick
            }
        >
          {(userId === to_user_id && !!false) ? t('userBalance.remind') : t('userBalance.payBack')}
        </Button>
      </div>
    </div>
  )
}
