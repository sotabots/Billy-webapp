import cx from 'classnames'

import Button from '../kit/Button'

import { useCategories } from '../hooks'

import { ReactComponent as PageLeftIcon } from '../assets/page-left.svg'
import { ReactComponent as PageRightIcon } from '../assets/page-right.svg'

const Pie = ({ isCompact, title, period, slices, onLeft, onRight }: {
  isCompact?: boolean
  title: string
  period: string
  slices: ({
    categoryKey: string,
    relativeValue: number
  })[]
  onLeft: null | VoidFunction
  onRight: null | VoidFunction
}) => {
  const { getCategoryColor } = useCategories()

  const transition = 'transition-all ease-linear duration-250'

  const sum = slices.reduce((acc, slice) => acc + slice.relativeValue, 0)

  let acc = 0
  let gradient = ''

  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i]
    const accPrev = acc
    acc += slice.relativeValue
    const fromPercent = (accPrev * 100 / sum).toFixed(2)
    const toPercent = (acc * 100 / sum).toFixed(2)
    const color = getCategoryColor(slice.categoryKey)
    gradient += `${i > 0 ? ', ' : ''}${color} ${i === 0 ? 0 : fromPercent}%, ${color} ${i === slices.length - 1 ? 100 : toPercent}%`
  }

  return (
    <div className="Pie relative">
      <div
        className={cx(
          'relative mx-auto rounded-full',
          transition,
          isCompact ? 'mt-4 w-full h-[8px]' : 'w-[200px] h-[200px]'
        )}
        style={{
          background: isCompact
            ? `linear-gradient(to right, ${gradient})`
            : `conic-gradient(${gradient})`
        }}
      >
        <div
          className={cx(
            'absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center w-[178px] h-[178px] rounded-full bg-bg',
            transition,
            isCompact && 'scale-0'
          )}>
          <div className="font-semibold text-[24px] leading-[32px]">{title}</div>
          <div className="text-[16px] leading-[24px] text-[#5B6871] tracking-[-0.176px]">
            {period === 'ALL_TIME' && 'All time'}
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-[50%] -translate-y-[50%] w-6 h-6">
        <Button
          theme="clear"
          className={cx(
            'w-6 h-6 enabled:active:scale-75',
            (!onLeft || isCompact) && 'scale-0'
          )}
          disabled={!onLeft || isCompact}
          onClick={onLeft || (() => {})}
          text={<PageLeftIcon />}
        />
      </div>
      <div className="absolute right-0 top-[50%] -translate-y-[50%] w-6 h-6">
        <Button
          theme="clear"
          className={cx(
            'w-6 h-6 enabled:active:scale-75',
            (!onRight || isCompact) && 'scale-0'
          )}
          disabled={!onRight || isCompact}
          onClick={onRight || (() => {})}
          text={<PageRightIcon />}
        />
      </div>
    </div>
  )
}

export default Pie
