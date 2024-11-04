import cx from 'classnames'

export const Dropdown = ({ className, items, value, onChange }: {
  className?: string,
  items: {
    text: string
    value: string
  }[],
  value: string,
  onChange: (value: string) => void
}) => (
  <div className={cx('Dropdown flex items-center gap-1 rounded-[6px] p-1 bg-[#8881]', className)}>
    {items.map((item, i) => (
      <button
        key={i}
        className={cx(
          'flex-grow basis-0 h-6 rounded-[6px] text-[14px] leading-[0.9em] text-[#0E73F6] transition-all',
          item.value === value && 'bg-[#8882] font-semibold',
        )}
        onClick={() => { onChange(item.value) }}
      >
        <span className="">{item.text}</span>
      </button>
    ))}
  </div>
)
