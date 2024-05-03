import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'

import { useInit } from '../hooks'
import { feedback, EVENT } from '../feedback'

function Settings() {
  useInit()

  const { t } = useTranslation()
  const [isEvent, setIsEvent] = useState(false)

  useEffect(() => {
    if (!isEvent) {
      setIsEvent(true)
      feedback(EVENT.OPEN_SETTINGS)
    }
  }, [isEvent, setIsEvent])

  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <div className="w-[280px] mx-auto flex flex-col gap-4 pt-[112px] text-center">
        settings
      </div>

      <Button
        isBottom
        text={t('close')}
        onClick={() => { history.back() }}
      />
    </Screen>
  )
}

export default Settings
