import cx from 'classnames'

import { useTranslation } from 'react-i18next'

import { Button } from '../kit'

import star from '../assets/star.png'

const textGradient = {
  'background': 'linear-gradient(85.8deg, #1C6ED8 3.42%, rgba(12, 215, 228, 0.99) 96.58%)',
  'WebkitBackgroundClip': 'text',
  'backgroundClip': 'text',
  'WebkitTextFillColor': 'transparent',
}

export const Plan = ({ className, label, title, stars, fiat, discount, isActive, onClick }: {
  className?: string
  label?: string
  title: string
  stars: number
  fiat: string
  discount?: string
  isActive: boolean
  onClick: (_: number) => void
}) => {
  const { t } = useTranslation()

  return (
    <Button
      wrapperClassName="Plan"
      className={cx(
        'Plan w-full',
        className,
      )}
      onClick={() => { onClick(stars) }}
    >
      <div className={cx(
        'relative rounded-[16px] p-[2px] transition-all',
        isActive ? 'bg-gradient-to-r from-[#1C6ED8] to-[#0CD7E4FC]' : 'bg-[#DDE2E4] dark:bg-[#5B6871]',
        label && 'mt-[14px]'
      )}>
        <div className="rounded-[14px] bg-bg text-[#6E7C87] text-left">
          {label &&
            <div
              className="absolute left-[10px] -top-[14px] inline-block mb-1 px-2 py-[2px] rounded-[20px] text-[#ffffff] text-[13px] leading-[18px] font-semibold bg-[#000000]"
            >
              {label}
            </div>
          }
          <div className="flex items-start gap-2 px-3 py-2">
            <div className="w-full flex flex-col gap-[2px]">
              <div className={cx(
                'font-semibold text-[16px] leading-[24px] transition-all',
                isActive ? 'text-text' : 'text-[#5B6871] dark:text-[#B0BABF]'
              )}>{title}</div>
              <div className="flex items-center gap-1 text-[16px] leading-[24px] dark:text-[#9AA6AC]">
                <img src={star} className="w-4 h-4" />
                <span className="">{stars} {t('paywall.stars')}</span>
                <span className="">•</span>
                <span className="">{fiat}</span>
              </div>
            </div>
            {discount &&
              <div className="" style={{ ...textGradient }}>
                <div className="text-[12px] leading-[16px] font-semibold">{t('paywall.discount')}</div>
                <div className="text-[24px] leading-[32px] font-semibold">{discount}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </Button>
  )
}
