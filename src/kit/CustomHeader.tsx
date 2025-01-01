import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '../kit'

import { ReactComponent as Back2 } from '../assets/back2.svg'

export const CustomHeader = ({ back, onBack, center, right }: {
  back?: string
  onBack?: () => void
  center?: string
  right?: ReactNode
}) => {
  const { t } = useTranslation()

  return (
    <header className="CustomHeader flex items-center justify-between p-4 min-h-[56px]">
      {!!back &&
        <Button
          wrapperClassName="flex-[0_0_64px]"
          className="flex items-center gap-1 text-icon"
          onClick={onBack || (() => { /* */ })}
        >
          <Back2 className="w-4 h-6" />
          <div className="text-[14px] leading-[20px]">{back || t('back')}</div>
        </Button>
      }
      {!!center &&
        <div className="flex-[1_1_auto] px-3 text-center text-[16px] leading-[32px] font-semibold truncate">{center}</div>
      }
      {!!right &&
        <div className="flex-[0_0_64px] flex justify-end">{right}</div>
      }
    </header>
  )
}
