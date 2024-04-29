import { useTranslation } from 'react-i18next'

import { useChatId } from '../hooks'

const DemoMode = () => {
  const { chatId } = useChatId()
  const { t } = useTranslation()

  return (chatId === 0) ? (
    <div className="DemoMode fixed top-0 width-auto left-[50%] -translate-x-[50%] px-4 py-[1px] text-[13px] leading-[1em] font-semibold bg-[#3a3] text-white rounded-b-md">{t('demoMode')}</div>
  ) : null
}

export default DemoMode
