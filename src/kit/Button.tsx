import { MainButton, useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'
import { ReactNode } from 'react'

import { usePlatform, useStore, useTheme } from '../hooks'
import { Limiter, Loader } from '../kit'

type TButton = {
  wrapperClassName?: string
  className?: string
  color?: string
  disabled?: boolean
  isBusy?: boolean
  onClick: () => void
} & ({
  theme: 'bottom'
  children: string
} | {
  theme?: 'default' | 'subBottom' | 'text' | 'settleUp' | 'settleUp2' | 'icon'
  children: ReactNode
})

export const Button = ({ theme = 'default', wrapperClassName, className, color, children, disabled, isBusy, onClick }: TButton) => {
  const { isTg } = usePlatform()
  const [impactOccurred] = useHapticFeedback()
  const { overlays } = useStore()
  const { isDark } = useTheme()

  const onClickVibro = disabled ? () => {/* */} : () => {
    console.log('Button vibro')
    impactOccurred(isBottom ? 'heavy' : 'light')
    onClick()
  }

  const isBottom = theme === 'bottom'

  if (isBottom && !!overlays.length) {
    return null
  }

  if (theme === 'bottom' && isTg) {
    return (
      <MainButton
        text={children as string}
        disabled={disabled}
        progress={isBusy}
        color={
          disabled ? '#888888' :
          color ? color :
          isDark ? '#4094F7' : '#0E73F6'
        }
        onClick={onClickVibro}
    />)
  }

  const themeStyle = {
    'default': '',

    'text': 'min-h-[24px] text-[14px] leading-[1.2em] text-blue enabled:hover:!brightness-[1.2] enabled:active:!brightness-[1.4] transition-all',

    'settleUp': 'min-h-[24px] border border-blue rounded-[4px] px-2 text-[14px] leading-[1.2em] text-blue enabled:hover:!brightness-[1.2] enabled:active:!brightness-[1.4] transition-all whitespace-nowrap',

    'settleUp2': 'min-h-[24px] rounded-[4px] px-2 bg-bg2 text-[14px] leading-[1.2em] text-blue font-semibold enabled:hover:!brightness-[1.2] enabled:active:!brightness-[1.4] transition-all whitespace-nowrap',

    'icon': 'block h-[24px] w-[24px] bg-transaprent p-0 opacity-40 text-text hover:opacity-70 active:opacity-100 transition-all',

    'bottom': 'mx-auto w-full block h-10 bg-blue text-textButton rounded-md text-[14px] leading-[20px] font-semibold',

    'subBottom': 'block w-full h-10 bg-[#7E10E5] text-textButton rounded-md text-[14px] leading-[24px] font-semibold transition-all',
  }[theme]

  const button = (
    <button
      className={cx(
        'enabled:hover:brightness-[1.1] enabled:active:brightness-[1.2] transition-all disabled:opacity-40 disabled:cursor-not-allowed',
        themeStyle,
        className,
      )}
      style={{ backgroundColor: color }}
      disabled={disabled || isBusy}
      onClick={onClickVibro}
    >
      {children}
    </button>
  )

  return (
    <div className={cx(
      'Button',
      (isBottom || theme === 'subBottom') && 'ButtonSpacer h-[56px]',
      wrapperClassName,
    )}>
      <div className={cx(
        'ButtonLoaderWrapper',
        (isBottom || theme === 'subBottom') ? 'fixed left-0 w-full py-2 bg-bg' : 'relative',
        isBottom && 'bottom-0 px-4',
        theme === 'subBottom' && (isTg ? 'bottom-0' : 'bottom-[56px]'),
      )}>
        {(isBottom || theme === 'subBottom') && (
          <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg" />
        )}
        {(isBottom || theme === 'subBottom')
          ? (
            <Limiter>
              {button}
            </Limiter>
          )
          : button
        }
        {isBusy && <Loader size={30} />}
      </div>
    </div>
  )
}
