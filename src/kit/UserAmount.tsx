import { MouseEventHandler } from 'react'

import InputAmount from './InputAmount'
import { TShare } from '../types'

import UserRelation from '../kit/UserRelation'

function UserAmount({ share, onClick, onChange }: {
  share: TShare
  onClick: MouseEventHandler<HTMLButtonElement>
  onChange: (value: number) => void
}) {
  return (
    <div className="flex gap-3 items-center">
      <UserRelation
        share={share}
        onClick={onClick}
      />
      <InputAmount amount={share.amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
