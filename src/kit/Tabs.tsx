import cx from 'classnames'
import { ReactNode } from 'react'

export const Tabs = ({ tabs, className, children }: {
  tabs: {
    title: string
    isActive: boolean
    onClick: VoidFunction
  }[],
  className?: string,
  children?: ReactNode,
}) => (
  <div className={cx('Tabs flex items-center gap-3 px-4', className)}>
    {tabs.map((tab, i) => (
      <button
        key={i}
        className={cx(
          'flex flex-grow basis-0 items-center justify-center gap-1 h-[30px] border-b text-[14px] leading-[0.9em] transition-all',
          !tab.isActive
            ? 'text-[#5B6871] dark:text-[#B0BABF] border-[#DDE2E4]'
            : 'text-[#0E73F6] border-[#0E73F6] font-semibold'
        )}
        onClick={tab.onClick}
      >
        <span className="text-left">{tab.title}</span>
      </button>
    ))}
    {children}
  </div>
)
