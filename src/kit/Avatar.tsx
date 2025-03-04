import { useTheme } from '../hooks'
import type { TUser, TUserChat } from '../types'

import { ReactComponent as UserIcon } from '../assets/user.svg'

const apiUrl = import.meta.env.VITE_API_URL

const getLetters = (fullName?: string) => {
  const letterParts = fullName ? fullName.split(' ') : []
  const letters = `${letterParts[0] ? letterParts[0][0] : ''}${letterParts[1] ? letterParts[1][0] : ''}`
  return letters
}

export const Avatar = ({ user, chat, url, text, size = 40 }: {
  user?: TUser // letters fallback
  chat?: TUserChat // letters fallback
  url?: string
  text?: string
  size?: number
}) => {
  const fullName = [
    ...(user?.first_name ? [user.first_name] : []),
    ...(user?.last_name ? [user.last_name] : []),
    ...(chat?.name ? [chat.name] : []),
  ].join(' ')

  const { isDark } = useTheme()

  const color =
    text
      ? '#0452C8'
      : (!user && !chat)
        ? 'transparent'
        : (['#e17076', '#faa774', '#a695e7', '#7bc862', '#6ec9cb', '#65aadd', '#ee7aae'])[Math.abs(Number(user?._id || chat?.id)) % 7 || 0] // peerColor

  const placeholderBgColor = isDark ? '#D7EDFF' : '#D7EDFF'
  const backgroundColor = (!user && !chat) ? placeholderBgColor : (color + '44')

  const _url = user?.profile_photo || chat?.photo || url
  const backgroundImage = !_url
    ? undefined
    : `url(${(_url.includes('https://') || _url.includes('/assets/'))
      ? _url
      : `${apiUrl}${_url}`})`

  const letters: string | null = (!_url && fullName) ? getLetters(fullName) : null
  const _text: string | null = text || letters

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-cover bg-center"
      style={{
        width: size,
        height: size,
        backgroundColor,
        backgroundImage
      }}
    >
      {_text &&
        <div
          className="uppercase font-semibold text-main"
          style={{
            fontSize: 0.35 * size + 'px',
            lineHeight: 0.6 * size + 'px',
            color
          }}
        >
          {_text}
        </div>
      }
      {!_url && !_text && (
        <UserIcon
          style={{ width: '80%', height: '80%' }}
          className="text-[#0452C8]"
        />
      )}
    </div>
  )
}
