// import Lottie from 'lottie-react'

import { useTheme, useChatId } from '../hooks'
import type { TUser } from '../types'

// import lottieKoalaLooking from '../assets/animation-koala-looking.json'
import { ReactComponent as UserIcon } from '../assets/user.svg'

const apiUrl = import.meta.env.VITE_API_URL

type TAvatar = {
  user?: TUser,
  size?: number
}

const getLetters = (fullName?: string) => {
  const letterParts = fullName ? fullName.split(' ') : []
  const letters = `${letterParts[0] ? letterParts[0][0] : ''}${letterParts[1] ? letterParts[1][0] : ''}`
  return letters
}

function Avatar({ user, size = 40 }: TAvatar) {
  const fullName = [
    ...(user?.first_name ? [user.first_name] : []),
    ...(user?.last_name ? [user.last_name] : []),
  ].join(' ')

  const { isDark } = useTheme()
  const placeholderBgColor = isDark ? '#D7EDFF' : '#D7EDFF'
  const color = !user ? 'transparent' : (['#e17076', '#faa774', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'])[Math.abs(Number(user._id)) % 7 || 0] // peerColor
  const backgroundColor = !user ? placeholderBgColor : (color + '44')

  const { chatId } = useChatId()
  const url = user?.profile_photo
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
        <UserIcon className="w-8 h-8 text-[#0452C8]" />
        // <Lottie
        //   style={{ height: 0.8 * size }}
        //   animationData={lottieKoalaLooking}
        //   loop={true}
        // />
      )}
    </div>
  )
}

export default Avatar
