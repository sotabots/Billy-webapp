import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { TUser } from '../types'

import { User, CheckBox } from '../kit'

export const UserButton = ({ user, isChecked, onClick }: {
  user: TUser
  isChecked?: boolean
  onClick: () => void
}) => {
  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const onClickVibro = () => {
    console.log('UserButton vibro')
    selectionChanged()
    impactOccurred('light')
    onClick()
  }

  return (
    <button
      className="flex items-center justify-between gap-2 w-full px-4 py-2 hover:bg-text/5 active:bg-text/10 transition-all"
      onClick={onClickVibro}
    >
      <User user={user} />
      {isChecked !== undefined && (
        <CheckBox isChecked={isChecked} />
      )}
    </button>
  )
}
