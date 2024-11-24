import cx from 'classnames'

export const Skeleton = ({ className, w, h }: {
  className?: string
  w: number
  h: number
}) => (
  <div
    className={cx('Skeleton rounded-full bg-text/[0.03] bg-gradient-to-r from-text/[0.03] to-text/[0.06] animate-skeleton', className)}
    style={{ width: w, height: h, backgroundSize: '200% 100%' }}
  />
)
