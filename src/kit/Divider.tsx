import cx from 'classnames'

function Divider({ className }: {
  className?: string
}) {
  return (
    <div className={cx(
      'Divider h-[1.1px] -my-[0.5px] mx-4 bg-[#E5E9EB] dark:bg-[#84919A]',
      className,
     )}
    />
  )
}

export default Divider
