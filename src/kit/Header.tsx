import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@vkruglikov/react-telegram-web-app'

import { ReactComponent as Back } from '../assets/back.svg'
import { useBack, usePlatform } from '../hooks'

export const Header = ({ className, todoRemove, onBack }: {
  onBack?: () => void
  className?: string
  todoRemove?: boolean
}) => {
  const { t } = useTranslation()
  const { isTg } = usePlatform()

  const { goBack } = useBack()
  const _onBack: (() => void ) | undefined = onBack || goBack

  if (isTg) {
    return (
      <div className={cx(
        'Header',
        todoRemove ? '' : 'h-3',
        className
      )}>
        {!!_onBack && (
          <BackButton
            onClick={_onBack}
          />
        )}
      </div>
    )
  }

  return (
    <header className={cx('Header sticky z-[1] top-0 flex items-center justify-center h-[64px] bg-bg', className)}>
      {!!_onBack &&
        <button
          className="flex items-center gap-[5px] absolute left-4 top-1/2 -translate-y-1/2 text-blue hover:brightness-[1.2] active:brightness-[1.4] transition-all"
          onClick={_onBack}
        >
          <Back />
          <span>{t('back')}</span>
        </button>
      }
      <div className="flex flex-col items-center justify-center gap-0.5">
        <div className="text-[17px] leading-[22px] font-semibold">Billy</div>
        <div className="text-textSec text-[13px] leading-[18px] font-semibold opacity-70">{t('bot')}</div>
      </div>
    </header>
  )
}
