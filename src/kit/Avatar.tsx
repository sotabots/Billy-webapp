import { useTheme } from '../hooks'
import { useStore } from '../store'
import type { TUser } from '../types'

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

  const { isDarkTheme } = useTheme()
  const placeholderColor = isDarkTheme ? '#888888' : '#bbbbbb'
  const color = !user ? placeholderColor: (['#e17076', '#faa774', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'])[Math.abs(Number(user._id)) % 7 || 0] // peerColor
  const backgroundColor = color + '44'

  const { txId } = useStore()
  const url = user?.profile_photo
  const backgroundImage = !url
    ? undefined
    : `url(${txId ? `${apiUrl}${url}` : url})`

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
    </div>
  )
}

export default Avatar
