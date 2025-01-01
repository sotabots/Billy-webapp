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
    <header className="CustomHeader flex items-center justify-between p-4">
      {!!onBack &&
        <Button
          className="flex items-center gap-1 text-icon"
          onClick={onBack}
        >
          <Back2 />
          <div className="text-[14px] leading-[20px]">{back || t('back')}</div>
        </Button>
      }
      {!!center &&
        <div className="">{center}</div>
      }
      {!!right &&
        <div className="">{right}</div>
      }
    </header>
  )
}
