import cx from 'classnames'

import { useTranslation } from 'react-i18next'

import Button from './Button'

import star from '../assets/star.png'

const textGradient = {
  background: 'linear-gradient(85.8deg, #1C6ED8 3.42%, rgba(12, 215, 228, 0.99) 96.58%)',
  '-webkit-background-clip': 'text',
  'background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
}

function Plan({ className, label, labelColor, title, stars, fiat, discount, isActive, onClick }: {
  className?: string
  label?: string
  labelColor?: string
  title: string
  stars: number
  fiat: string
  discount?: string
  isActive: boolean
  onClick: (_: number) => void
}) {
  const { t } = useTranslation()

  return (
    <Button
      theme="clear"
      className={cx(
        'Plan w-full',
        className,
      )}
      onClick={() => { onClick(stars) }}
      text={
        <div className={cx(
          'relative rounded-[16px] p-[2px] transition-all',
          isActive ? 'bg-gradient-to-r from-[#1C6ED8] to-[#0CD7E4FC]' : 'bg-[#DDE2E4]',
          label && 'mt-[14px]'
        )}>
          <div className="rounded-[14px] bg-bg text-[#6E7C87] text-left">
            {label &&
              <div
                className="absolute left-[10px] -top-[14px] inline-block mb-1 px-2 py-[2px] rounded-[20px] text-[#ffffff] text-[13px] leading-[18px] font-semibold bg-text"
                style={{ backgroundColor: labelColor }}
              >
                {label}
              </div>
            }
            <div className="flex items-start gap-2 px-3 py-2">
              <div className="w-full flex flex-col gap-[2px]">
                <div className={cx(
                  'font-semibold text-[16px] leading-[24px] transition-all',
                  isActive ? 'text-text' : 'text-[#5B6871]'
                )}>{title}</div>
                <div className="flex items-center gap-1 text-[16px] leading-[24px]">
                  <img src={star} className="w-4 h-4" />
                  <span className="">{stars} {t('stars')}</span>
                  <span className="">•</span>
                  <span className="">{fiat}</span>
                </div>
              </div>
              {discount &&
                <div className="" style={{ ...textGradient }}>
                  <div className="text-[12px] leading-[16px] font-semibold">{t('discount')}</div>
                  <div className="text-[24px] leading-[32px] font-semibold">{discount}</div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    />
  )
}

export default Plan
