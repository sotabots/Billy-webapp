import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { TUser } from '../types'

import User from './User'

import { ReactComponent as CheckIcon } from '../assets/check.svg'

type TProps = {
  user: TUser,
  isChecked?: boolean,
  onClick: () => void,
}

function UserButton({ user, isChecked, onClick }: TProps) {
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
      {isChecked && (
        <div className="mr-2 w-6 h-6">
          <CheckIcon />
        </div>
      )}
    </button>
  )
}

export default UserButton
