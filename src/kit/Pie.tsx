import cx from 'classnames'

import Button from '../kit/Button'

import { ReactComponent as PageLeftIcon } from '../assets/page-left.svg'
import { ReactComponent as PageRightIcon } from '../assets/page-right.svg'

const Pie = ({ period, onLeft, onRight }: {
  period: string,
  onLeft: null | VoidFunction,
  onRight: null | VoidFunction,
}) => (
  <div className="Pie relative">
    <div
      className="relative mx-auto w-[200px] h-[200px] rounded-full"
      style={{
        background: 'conic-gradient(#82C4B8 0%, #82C4B8 66%, #B89AE4 66%, #B89AE4 88%, #FFBE7C 88%, #FFBE7C 100%)'
      }}
    >
      <div
        className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-center w-[178px] h-[178px] rounded-full bg-bg">
        <div className="font-semibold text-[24px] leading-[32px]">$38,654.55</div>
        <div className="text-[16px] leading-[24px] text-[#5B6871] tracking-[-0.176px]">
          {period === 'ALL_TIME' && 'All time'}
        </div>
      </div>
    </div>
    <div className="absolute left-0 top-[50%] -translate-y-[50%] w-6 h-6">
      <Button
        theme="clear"
        className={cx('w-6 h-6 enabled:active:scale-75', !onLeft && 'scale-0')}
        disabled={!onLeft}
        onClick={onLeft || (() => {})}
        text={<PageLeftIcon />}
      />
    </div>
    <div className="absolute right-0 top-[50%] -translate-y-[50%] w-6 h-6">
      <Button
        theme="clear"
        className={cx('w-6 h-6 enabled:active:scale-75', !onRight && 'scale-0')}
        disabled={!onRight}
        onClick={onRight || (() => {})}
        text={<PageRightIcon />}
      />
    </div>
  </div>
)

export default Pie
