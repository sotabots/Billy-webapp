import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useUser, useGetUserSettings, usePostUserSettings } from '../hooks'
import { Divider, MenuItem, MenuGroup, Page, Header, Button } from '../kit'

import { ReactComponent as ProIcon } from '../assets/user-settings-pro.svg'
import { ReactComponent as CardIcon } from '../assets/user-settings-card.svg'
import { ReactComponent as CurrencyIcon } from '../assets/user-settings-currency.svg'

export const PaymentMethods = () => {
  useInit()

  const { t } = useTranslation()
  const { isPro } = useUser()
  const { data: userSettings, refetch: refetchUserSettings } = useGetUserSettings()
  const postUserSettings = usePostUserSettings()

  const navigate = useNavigate()

  const [/*isBusy*/, setBusy] = useState(false)

  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const onChangeCurrency = async () => {
    if (!userSettings) {
      return
    }
    selectionChanged()
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postUserSettings({
        ...userSettings,
        currency: '',
      })
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchUserSettings()
      setSettingsInner(null)
    }
    setBusy(false)
  }

  const [settingsInner, setSettingsInner] = useState<null | string>(null)

  return (
    <Page className={cx(settingsInner ? '!bg-bg' : '')}>
      <Header onBack={
        settingsInner
          ? () => { setSettingsInner(null) }
          : undefined
      } />

      {!settingsInner && (
        <div className="px-4 pb-4">
          <h2 className="pt-3 pb-4">{t('userSettings.title')}</h2>
          <div className="flex flex-col gap-4">
            <MenuGroup>
              <MenuItem
                icon={<ProIcon />}
                title={t('userSettings.pro')}
                value={isPro ? t('userSettings.active') : ''}
                onClick={() => {
                  if (isPro === false) {
                    navigate('/paywall')
                  }
                }}
                disabled={isPro === undefined || isPro === true}
              />
            </MenuGroup>
            <MenuGroup description={t('userSettings.cardsDescription')}>
              <MenuItem
                icon={<CardIcon />}
                title={t('userSettings.cards')}
                value={t('soon')}
                onClick={() => { /* */ }}
                disabled={true}
              />
            </MenuGroup>
            <MenuGroup description={t('userSettings.currencyDescription')}>
              <MenuItem
                icon={<CurrencyIcon />}
                title={t('userSettings.currency')}
                value={userSettings?.currency || ''}
                onClick={() => {
                  setSettingsInner('currency')
                }}
              />
              <Divider className="" />
            </MenuGroup>
          </div>
          <Button
            theme="bottom"
            onClick={() => {
              onChangeCurrency()
              history.back()
            }}
          >
            {t('save')}
          </Button>
        </div>
      )}

    </Page>
  )
}
