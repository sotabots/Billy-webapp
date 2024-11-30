import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useUser, useGetUserSettings, usePostUserSettings } from '../hooks'
import { Button, Divider, MenuItem, MenuGroup, RadioButton, Currencies, Page } from '../kit'
import { /* TCurrencyId, */ TLanguageCode, /* TMode, */ TCurrencyId} from '../types'

import { ReactComponent as ProIcon } from '../assets/user-settings-pro.svg'
import { ReactComponent as CardIcon } from '../assets/user-settings-card.svg'
import { ReactComponent as CurrencyIcon } from '../assets/user-settings-currency.svg'
import { ReactComponent as LanguageIcon } from '../assets/user-settings-language.svg'
import { ReactComponent as NotifyIcon } from '../assets/user-settings-notify.svg'

export const UserSettings = () => {
  useInit()

  const { t } = useTranslation()
  const { isPro, userLang } = useUser()
  const { data: userSettings, refetch: refetchUserSettings } = useGetUserSettings()
  const postUserSettings = usePostUserSettings()

  const navigate = useNavigate()

  const [/*isBusy*/, setBusy] = useState(false)

  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const onChangeCurrency = async (currencyId: TCurrencyId) => {
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
        currency: currencyId,
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

  const onChangeLanguage = async (languageCode: TLanguageCode) => {
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
        language: languageCode,
      })
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchUserSettings()
    }
    setBusy(false)
  }

  const toggleNotify = async () => {
    if (!userSettings) {
      return
    }
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postUserSettings({
        ...userSettings,
        notify_in_private_messages: !userSettings.notify_in_private_messages,
      })
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchUserSettings()
    }
    setBusy(false)
  }

  const langs: {
    _id: TLanguageCode,
    title: string
  }[] = [
    {
      _id: 'en',
      title: 'English',
    },
    {
      _id: 'ru',
      title: 'Русский',
    },
  ]

  const [settingsInner, setSettingsInner] = useState<null | string>(null)

  return (
    <Page>
      {!settingsInner && (
        <div className="px-4 pb-4">
          <MenuGroup className="mt-5">
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
            <Divider className="mr-0" />
            <MenuItem
              icon={<CardIcon />}
              title={t('userSettings.cards')}
              value={t('soon')}
              onClick={() => { /* */ }}
              disabled={true}
            />
          </MenuGroup>
          <MenuGroup className="mt-5">
            <MenuItem
              icon={<CurrencyIcon />}
              title={t('currency')}
              value={userSettings?.currency || ''}
              onClick={() => {
                setSettingsInner('currency')
              }}
            />
            <Divider className="mr-0" />
            <MenuItem
              icon={<LanguageIcon />}
              title={t('language')}
              value={userLang
                ? (
                  langs.find(lang => lang._id === userLang)?.title ||
                  userLang.toUpperCase())
                : ''
              }
              onClick={() => {
                setSettingsInner('language')
              }}
            />
            <Divider className="mr-0" />
          </MenuGroup>

          <MenuGroup className="mt-4">
            <MenuItem
              icon={<NotifyIcon />}
              title={t('userSettings.notify')}
              isEnabled={userSettings?.notify_in_private_messages}
              onClick={toggleNotify}
            />
          </MenuGroup>

          <Button
            theme="bottom"
            onClick={() => { history.back() }}
          >
            {t('close')}
          </Button>
        </div>
      )}

      {settingsInner === 'currency' && (
        <>
          <div className="px-4">
            <h2>{t('chooseCurrency')}</h2>
          </div>
          <Currencies
            className="mt-4"
            value={userSettings?.currency}
            onChange={onChangeCurrency}
          />
        </>
      )}

      {settingsInner === 'language' && (
        <>
          <div className="px-4">
            <h2>{t('chooseLanguage')}</h2>
          </div>
          <div className="mt-4 overflow-y-auto">
            {langs.map((lang, i) => (
              <div key={`languages-${lang._id}`}>
                <RadioButton
                  group="languages"
                  label={(
                    <span>{lang.title}</span>
                  )}
                  key={`lang-${lang._id}`}
                  value={lang._id}
                  checked={userLang === lang._id}
                  onChange={(langCode) => { onChangeLanguage(langCode as TLanguageCode) }}
                />
                {i < langs.length - 1 && <Divider key={`Divider-${i}`} />}
              </div>
            ))}
          </div>
        </>
      )}
    </Page>
  )
}
