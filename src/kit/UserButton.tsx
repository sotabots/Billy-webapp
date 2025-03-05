import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { ReactNode } from 'react'

import { TUser } from '../types'

import { User, CheckBox } from '../kit'
import { ReactComponent as ChevronIcon } from '../assets/page-right.svg'

export const UserButton = ({ user, right, isChecked, isChevron, onClick }: {
  user: TUser
  right?: ReactNode
  isChecked?: boolean
  isChevron?: boolean
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
      <div className="flex items-center gap-2">
        {isChecked !== undefined && (
          <CheckBox isChecked={isChecked} />
        )}
        {right}
        {isChevron &&
          <ChevronIcon className="w-6 h-6 text-[#6E7C87]" />
        }
      </div>
    </button>
  )
}
