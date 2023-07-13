import Avatar from "./Avatar"
import InputAmount from "./InputAmount"

type TUserAmount = {
  url?: string
  name: string
  username: string
  amount: number
  onChange: (value: number) => void
}

function UserAmount({ url, name, username, amount, onChange }: TUserAmount) {
  return (
    <div className="flex gap-3">
      <Avatar url={url} size={48} name={name} />
      <div className="flex flex-col -gap-0.5 flex-1 truncate">
        <div className="truncate">{name}</div>
        <div className="text-[14px] leading-[20px] text-hint truncate">@{username}</div>
      </div>
      <InputAmount amount={amount} onChange={onChange} />
    </div>
  )
}

export default UserAmount
