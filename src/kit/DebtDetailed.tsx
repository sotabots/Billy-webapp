import { User, InputAmount, Button } from '../kit'

import { useFeedback, useUsers } from '../hooks'
import { TDebt, TUserId } from '../types'

import { ReactComponent as ToIcon } from '../assets/to.svg'
import { ReactComponent as NextIcon } from '../assets/next.svg'

export const DebtDetailed = ({ debt, amount, setAmount, customRecipientId, onClickRecipient }: {
  debt: TDebt
  amount: number
  setAmount: (_: number) => void
  customRecipientId: null | TUserId
  onClickRecipient: VoidFunction
}) => {
  const { feedback } = useFeedback()
  const { getUserById } = useUsers()

  const { from_user_id, to_user_id, currency_id } = debt

  const fromUser = getUserById(from_user_id)
  const toUser = getUserById(customRecipientId || to_user_id)

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <User user={fromUser} size={48} />
        <InputAmount
          amount={amount}
          onChange={setAmount}
        />
      </div>
      <Button
        className="w-full flex items-center gap-3 pl-6 py-1 rounded-[6px] hover:bg-text/5 active:bg-text/10 transition-all"
        onClick={() => {
          onClickRecipient()
          feedback('change_user_settleup_web', {
            user_to_prev: toUser._id,
            amount: amount,
            currency: currency_id,
          })
        }}
      >
        <>
          <div className="h-[14px] w-[14px]">
            <ToIcon />
          </div>
          <User user={toUser} size={32} />
          <NextIcon className="h-6 w-6 text-textSec opacity-50" />
        </>
      </Button>
    </div>
  )
}
