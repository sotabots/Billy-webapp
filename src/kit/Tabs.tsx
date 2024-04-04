import cx from 'classnames'

const Tabs = ({ tabs, className }: {
  tabs: {
    icon: any
    title: string
    isActive: boolean
    onClick: VoidFunction
  }[],
  className?: string,
}) => (
  <div className={cx('Tabs flex items-center gap-3 px-4', className)}>
    {tabs.map((tab, i) => (
      <button
        key={i}
        className={cx(
          'flex flex-grow basis-0 items-center justify-center gap-1 h-[30px] border-b text-[14px] leading-[0.9em] transition-all',
          !tab.isActive
            ? 'text-[#B0BABF] border-[#DDE2E4]'
            : 'text-[#0E73F6] border-[#0E73F6] font-semibold'
        )}
        onClick={tab.onClick}
      >
        <tab.icon />
        <span className="text-left">{tab.title}</span>
      </button>
    ))}
  </div>
)

export default Tabs
