import i18n from '../i18n'

const DateMark = ({ time }: { time: number }) => {

  const date = new Date(time)
  const isCurrentYear = (new Date()).getFullYear() === date.getFullYear()

  return (
    <div
      className="DateMark mx-auto inline-block rounded-full px-2 bg-[#8881] text-[14px] leading-[24px] font-semibold dark:bg-[#B0BABF] dark:text-[#252C32]"
    >
      {date.toLocaleDateString(i18n.language, {
        day: 'numeric',
        month: 'short',
        ...(isCurrentYear ? {} : { year: 'numeric' })
      })}
    </div>
  )
}

export default DateMark
