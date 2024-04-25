import cx from 'classnames'

const RadioButtons = ({ items, activeValue, onChange, className }: {
  items: {
    title: string
    value: string
  }[],
  activeValue: string,
  onChange: (value: string) => void
  className?: string,
}) => (
  <div className={cx('RadioButtons flex items-center gap-1 rounded-[6px] p-1 bg-[#8881]', className)}>
    {items.map((item, i) => (
      <button
        key={i}
        className={cx(
          'flex-grow basis-0 h-6 rounded-[6px] text-[14px] leading-[0.9em] text-[#0E73F6] transition-all',
          item.value === activeValue && 'bg-[#8882] font-semibold',
        )}
        onClick={() => { onChange(item.value) }}
      >
        <span className="">{item.title}</span>
      </button>
    ))}
  </div>
)

export default RadioButtons
