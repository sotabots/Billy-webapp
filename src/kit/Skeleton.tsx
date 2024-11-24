import cx from 'classnames'

export const Skeleton = ({ className, w, h }: {
  className?: string
  w: number
  h: number
}) => (
  <div
    className={cx('Skeleton rounded-full bg-text/10 bg-gradient-to-r from-text/10 to-text/20 animate-skeleton', className)}
    style={{ width: w, height: h, backgroundSize: '200% 100%' }}
  />
)
