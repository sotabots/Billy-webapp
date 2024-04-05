import cx from 'classnames'

type TItem = {
  title: string
  value: string
}

const RadioButtons = ({ items, activeItem, onChange, className }: {
  items: TItem[],
  activeItem: TItem,
  onChange: (item: TItem) => void
  className?: string,
}) => (
  <div className={cx('RadioButtons flex items-center gap-1 rounded-[6px] p-1 bg-[#8881]', className)}>
    {items.map((item, i) => (
      <button
        key={i}
        className={cx(
          'flex-grow basis-0 h-6 rounded-[6px] text-[14px] leading-[0.9em] text-[#0E73F6] transition-all',
          item.value === activeItem.value && 'bg-[#8882] font-semibold',
        )}
        onClick={() => { onChange(item) }}
      >
        <span className="">{item.title}</span>
      </button>
    ))}
  </div>
)

export default RadioButtons
