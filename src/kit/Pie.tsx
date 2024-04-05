import cx from 'classnames'

import Button from '../kit/Button'

import { ReactComponent as PageLeftIcon } from '../assets/page-left.svg'
import { ReactComponent as PageRightIcon } from '../assets/page-right.svg'

const Pie = ({ onLeft, onRight }: {
  onLeft: null | VoidFunction,
  onRight: null | VoidFunction,
}) => (
  <div className="relative">
    <div
      className="Pie mx-auto w-[200px] h-[200px] rounded-full bg-[#8881]"
      // style={{ width: size, height: size }}
    >
      <div className="w-[200px] h-[200px]" style={{
        borderRadius: '50%',
        background: 'radial-gradient(closest-side, white 85%, transparent 86% 100%), conic-gradient(#82C4B8 0%, #82C4B8 66%, #B89AE4 66%, #B89AE4 88%, #FFBE7C 88%, #FFBE7C 100%)'
      }}>
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
