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
  <div className={cx(
    'Tabs flex items-center gap-3 px-4',
    false && 'sticky top-0 mb-[6px] pb-[2px] pt-2 bg-bg2 z-[1]', // sticky
    className
  )}>
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
    {false &&
      <div className="absolute top-full left-0 w-full h-1 bg-gradient-to-b from-bg2" />
    }
  </div>
)
