const DateMark = ({ time }: { time: number }) => {

  const date = new Date(time)
  const isCurrentYear = (new Date()).getFullYear() === date.getFullYear()

  return (
    <div
      className="DateMark mx-auto inline-block rounded-full px-2 bg-[#8881] text-[14px] leading-[24px] font-semibold"
    >
      {date.toLocaleDateString('en-EN', {
        day: 'numeric',
        month: 'short',
        ...(isCurrentYear ? {} : { year: 'numeric', })
      })}
    </div>
  )
}

export default DateMark
