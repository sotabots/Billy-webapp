import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import Divider from '../kit/Divider'
import MenuItem from '../kit/MenuItem'

import { useInit } from '../hooks'
import { feedback, EVENT } from '../feedback'
import { useStore } from '../store'

import { ReactComponent as SettingsCurrencyIcon } from '../assets/settings-currency.svg'
import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'

function Settings() {
  useInit()

  const { t } = useTranslation()
  const { chat } = useStore()

  const [isEvent, setIsEvent] = useState(false)

  useEffect(() => {
    if (!isEvent) {
      setIsEvent(true)
      feedback(EVENT.OPEN_SETTINGS)
    }
  }, [isEvent, setIsEvent])

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  const closeInnerPages = () => {
    setIsCurrencyOpen(false)
    setIsLanguageOpen(false)
  }

  const isOpen = isCurrencyOpen || isLanguageOpen

  return (
    <Screen>
      <Header onBack={() => { isOpen ? closeInnerPages() : history.back() }} />

      {!isOpen && (
        <div className="m-4 rounded-[12px] overflow-hidden">
          <MenuItem
            icon={<SettingsCurrencyIcon />}
            title={t('currency')}
            value={chat?.default_currency || ''}
            onClick={() => { setIsCurrencyOpen(true) }}
          />
          <Divider className="mr-0 !bg-[#D5DADD]" />
          <MenuItem
            icon={<SettingsLanguageIcon />}
            title={t('language')}
            value={chat?.language_code.toUpperCase() || ''}
            onClick={() => { setIsLanguageOpen(true) }}
          />
        </div>
      )}

      {isCurrencyOpen && (
        <div />
      )}

      {isLanguageOpen && (
        <div />
      )}

      <Button
        isBottom
        text={t('close')}
        onClick={() => { history.back() }}
      />
    </Screen>
  )
}

export default Settings
