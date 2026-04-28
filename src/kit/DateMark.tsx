import i18n from '../i18n'

export const DateMark = ({ time, variant = 'pill' }: {
  time: number
  variant?: 'pill' | 'plain'
}) => {
  const date = new Date(time)
  const isCurrentYear = (new Date()).getFullYear() === date.getFullYear()

  const text = date.toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    ...(isCurrentYear ? {} : { year: 'numeric' })
  })

  if (variant === 'plain') {
    return (
      <div className="DateMark mx-auto text-[14px] leading-5 text-textSec">
        {text}
      </div>
    )
  }

  return (
    <div
      className="DateMark mx-auto inline-block rounded-full px-2 bg-[#8881] text-[14px] leading-[24px] font-semibold dark:bg-[#B0BABF] dark:text-[#252C32]"
    >
      {text}
    </div>
  )
}
