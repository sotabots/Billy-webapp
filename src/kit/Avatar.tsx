// import Lottie from 'lottie-react'

import { useTheme, useChatId } from '../hooks'
import type { TUser, TUserChat } from '../types'

// import lottieKoalaLooking from '../assets/animation-koala-looking.json'
import { ReactComponent as UserIcon } from '../assets/user.svg'

const apiUrl = import.meta.env.VITE_API_URL

const getLetters = (fullName?: string) => {
  const letterParts = fullName ? fullName.split(' ') : []
  const letters = `${letterParts[0] ? letterParts[0][0] : ''}${letterParts[1] ? letterParts[1][0] : ''}`
  return letters
}

export const Avatar = ({ user, chat, size = 40 }: {
  user?: TUser
  chat?: TUserChat
  size?: number
}) => {
  const fullName = [
    ...(user?.first_name ? [user.first_name] : []),
    ...(user?.last_name ? [user.last_name] : []),
    ...(chat?.name ? [chat.name] : []),
  ].join(' ')

  const { isDark } = useTheme()
  const placeholderBgColor = isDark ? '#D7EDFF' : '#D7EDFF'
  const color = (!user && !chat)
    ? 'transparent'
    : (['#e17076', '#faa774', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'])[Math.abs(Number(user?._id || chat?.id)) % 7 || 0] // peerColor
  const backgroundColor = (!user && !chat) ? placeholderBgColor : (color + '44')

  const { chatId } = useChatId()
  const url = user?.profile_photo || chat?.photo
  const backgroundImage = !url
    ? undefined
    : `url(${(chatId === 0) ? url : `${apiUrl}${url}`})`

  const letters = (!url && fullName) ? getLetters(fullName) : null

  return (
    <div
      className="flex items-center justify-center rounded-full bg-cover bg-center"
      style={{
        width: size,
        height: size,
        backgroundColor,
        backgroundImage
      }}
    >
      {letters &&
        <div
          className="uppercase font-semibold text-main"
          style={{
            fontSize: 0.35 * size + 'px',
            lineHeight: 0.6 * size + 'px',
            color
          }}
        >
          {letters}
        </div>
      }
      {!user && (
        <UserIcon
          style={{ width: '80%', height: '80%' }}
          className="text-[#0452C8]"
        />
        // <Lottie
        //   style={{ height: 0.8 * size }}
        //   animationData={lottieKoalaLooking}
        //   loop={true}
        // />
      )}
    </div>
  )
}
