import User from './User'
import InputAmount from './InputAmount'
import Button from './Button'

import { useUsers } from '../hooks'
import { TDebt, TUserId } from '../types'

import { ReactComponent as ToIcon } from '../assets/to.svg'
import { ReactComponent as NextIcon } from '../assets/next.svg'

function DebtDetailed({ from_user, to_user, amount, customRecipientId, onClickRecipient }: TDebt & {
  customRecipientId: null | TUserId
  onClickRecipient: VoidFunction
}) {
  const { getUserById } = useUsers()

  const fromUser = getUserById(from_user._id)
  const toUser = getUserById(customRecipientId || to_user._id)

  if (!fromUser || !toUser) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <User user={fromUser} size={48} />
        <InputAmount amount={amount} />
      </div>
      <Button
        theme="clear"
        className="w-full flex items-center gap-3 pl-6 py-1 rounded-[6px] hover:bg-text/5 active:bg-text/10 transition-all"
        onClick={onClickRecipient}
        text={
          <>
            <div className="h-[14px] w-[14px]">
              <ToIcon />
            </div>
            <User user={toUser} size={32} />
            <NextIcon className="h-6 w-6 text-hint opacity-50" />
          </>
        }
      />
    </div>
  )
}

export default DebtDetailed
