import { useTheme } from '../hooks'

type TAvatar = {
  url?: string,
  fullName?: string,
  size?: number
}

const getLetters = (fullName?: string) => {
  const letterParts = fullName ? fullName.split(' ') : []
  const letters = `${letterParts[0] ? letterParts[0][0] : ''}${letterParts[1] ? letterParts[1][0] : ''}`
  return letters
}

const getColor = (fullName?: string) => {
  // return name ? '#0452C8' : '#0452C8' // todo: generate
  return fullName ? undefined : undefined
}

function Avatar({ url, fullName, size = 40 }: TAvatar) {
  const color = getColor(fullName)
  const { isDarkTheme } = useTheme()
  const placeholderBg = isDarkTheme ? '#9AA6AC' : '#EEF0F2'
  const backgroundColor = (!url && fullName) ? color + '22' : placeholderBg
  const letters = (!url && fullName) ? getLetters(fullName) : null

  return (
    <div
      className="flex items-center justify-center rounded-full bg-cover bg-center"
      style={{
        width: size,
        height: size,
        backgroundColor,
        backgroundImage: `url(${url})`
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
