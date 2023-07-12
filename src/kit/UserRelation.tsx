import { MouseEventHandler } from "react"
import Avatar from "./Avatar"

import { ReactComponent as Next } from './../img/next.svg'

type TUser = {
  url?: string
  name: string
  username: string
}

type TUserRelation = {
  title: string
  user?: TUser
  onClick: MouseEventHandler<HTMLButtonElement>
}

function UserRelation({ title, user, onClick }: TUserRelation) {
  return (
    <button
      className="w-full flex gap-3 text-left items-center px-4 py-2.5 truncate hover:bg-text/5 active:bg-text/10 transition-all"
      onClick={onClick}
    >
      <div className="flex w-[45%] truncate">
        <div className="truncate">{title}</div>
      </div>
      <div className="flex gap-3 w-[45%] items-center truncate">
        <Avatar url={user?.url} size={32} name={user?.name} />
        <div className="text-hint truncate">{user?.username ? `@${user.username}` : '@name'}</div>
      </div>
      <div className="h-6 w-6 text-hint opacity-50">
        <Next />
      </div>
    </button>
  )
}

export default UserRelation
