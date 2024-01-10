import { useTranslation } from 'react-i18next'

import { useStore } from '../store'

const DemoMode = () => {
  const { txId } = useStore()
  const { t } = useTranslation()

  return txId !== null ? null : (
    <div className="fixed top-0 width-auto left-[50%] -translate-x-[50%] px-4 py-[1px] text-[13px] leading-[1em] font-semibold bg-[#3a3] text-white rounded-b-md">{t('demoMode')}</div>
  )
}

export default DemoMode
