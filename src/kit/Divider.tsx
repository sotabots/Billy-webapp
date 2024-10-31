import cx from 'classnames'

export const Divider =({ className }: {
  className?: string
}) => {
  return (
    <div className={cx(
      'Divider h-[1.5px] -my-[0.5px] mx-4 bg-separator',
      className,
     )}
    />
  )
}
