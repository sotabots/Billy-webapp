import cx from 'classnames'

export const VoiceLimit =({ className }: {
  className?: string
  theme?: 'gray'
}) => {
  return (
    <div className={cx(
      'VoiceLimit',
      className,
     )}
    />
  )
}
