import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'

import { ReactComponent as EditIcon } from '../assets/edit.svg'

const Transaction = ({ }: { }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const backgroundColor = '#8884' || ['#82C4B8', '#B89AE4', '#FFBE7C', '#85BADA', '#FF9D97'][Math.floor(Math.random() * 5)]
  const emoji = ' ' || '🛒'
  const isPayer = Math.random() > 0.5

  return (
    <div className="Transaction flex gap-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor }}>{emoji}</div>
      <div className="flex-1 flex flex-col gap-[2px] text-[14px] leading-[24px]">
        <div className="flex gap-2 items-center justify-between px-2 font-semibold">
          <span>Name Surname</span>
          <span>$3 333.34</span>
        </div>
        <div className={cx(
          'flex gap-2 items-center justify-between  rounded-[4px] px-2 bg-[#8881] font-semibold',
          isPayer ? 'text-[#119C2B]' : 'text-[#CC0905]'
        )}>
          <span>{isPayer ? t('youLent') : t('youOwe')}</span>
          <span>$1,030.00</span>
        </div>
        {/*
        <div className="px-2 opacity-60">Some short description about tx</div>
         */}
      </div>
      <Button
        // disabled
        theme="clear"
        className="w-6 h-6"
        text={<EditIcon />}
        onClick={() => { navigate('/paywall') }}
      />
    </div>
  )
}

export default Transaction
