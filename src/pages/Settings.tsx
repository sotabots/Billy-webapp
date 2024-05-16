import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import Divider from '../kit/Divider'
import MenuItem from '../kit/MenuItem'
import RadioButton from '../kit/RadioButton'

import { usePostChatCurrency, usePostChatLanguage, useGetChat } from '../api'
import { useChatId, useInit, useFeedback } from '../hooks'
import { useStore } from '../store'
import { TCurrencyId, TLanguageCode } from '../types'

import { ReactComponent as SettingsCurrencyIcon } from '../assets/settings-currency.svg'
import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'

function Settings() {
  useInit()

  const { t, i18n } = useTranslation()
  const { currencies, chat } = useStore()
  const { feedback } = useFeedback()

  const closeInnerPages = () => {
    setIsCurrencyOpen(false)
    setIsLanguageOpen(false)
  }

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  /*
  const [currency, setCurrency] = useState<TCurrencyId>(chat?.default_currency || 'USD')

  useEffect(() => {
    setCurrency(chat?.default_currency || 'USD')
  }, [chat?.default_currency, setCurrency])
  */

  const isOpen = isCurrencyOpen || isLanguageOpen
  const [/*isBusy*/, setBusy] = useState(false)

  const postChatCurrency = usePostChatCurrency()
  const postChatLanguage = usePostChatLanguage()

  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const { chatId } = useChatId()
  const { refetch: refetchChat } = useGetChat(chatId)

  const onChangeCurrency = async (currencyId: TCurrencyId) => {
    selectionChanged()
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatCurrency(currencyId)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      feedback('set_currency_settings_web', {
        currency_prev: chat?.default_currency,
        currency_set: currencyId,
      })
      refetchChat()
      closeInnerPages()
    }
    setBusy(false)
  }

  const onChangeLanguage = async (languageCode: TLanguageCode) => {
    selectionChanged()
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatLanguage(languageCode)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      feedback('set_language_settings_web', {
        language_prev: chat?.language_code,
        language_set: languageCode,
      })
      refetchChat()
      closeInnerPages()
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
    {
      _id: 'uk',
      title: 'Український',
    },
  ]

  return (
    <Screen>
      <Header onBack={() => { isOpen ? closeInnerPages() : history.back() }} />

      {!isOpen && (
        <>
          <div className="m-4 rounded-[12px] overflow-hidden">
            <MenuItem
              icon={<SettingsCurrencyIcon />}
              title={t('currency')}
              value={chat?.default_currency || ''}
              onClick={() => {
                setIsCurrencyOpen(true)
                feedback('press_currency_settings_web', {
                  currency_prev: chat?.default_currency,
                })
              }}
            />
            <Divider className="mr-0 !bg-[#D5DADD]" />
            <MenuItem
              icon={<SettingsLanguageIcon />}
              title={t('language')}
              value={chat?.language_code
                ? (
                  langs.find(lang => lang._id === chat?.language_code)?.title ||
                  chat.language_code.toUpperCase())
                : ''
              }
              onClick={() => {
                setIsLanguageOpen(true)
                feedback('press_language_settings_web', {
                  language_prev: chat?.language_code,
                })
              }}
            />
          </div>

          <Button
            isBottom
            text={t('close')}
            onClick={() => { history.back() }}
          />
        </>
      )}

      {isCurrencyOpen && (
        <>
          <div className="px-4">
            <h2>{t('chooseCurrency')}</h2>
          </div>
          <div className="mt-4 overflow-y-auto">
            {currencies.map((currencyItem, i) => (
              <div key={`currencies-${currencyItem._id}`}>
                <RadioButton
                  group="currencies"
                  label={(
                    <>
                      <span className="font-semibold">{currencyItem.symbol}</span>
                      {' '}
                      <span>{currencyItem.title[i18n.language as TLanguageCode]}</span>
                    </>
                  )}
                  key={`currencies-${currencyItem._id}`}
                  value={currencyItem._id}
                  checked={chat?.default_currency === currencyItem._id}
                  onChange={onChangeCurrency}
                />
                {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
              </div>
            ))}
          </div>
          {/*
          <Button
            isBottom
            text={t('apply')}
            onClick={() => { history.back() }}
            isBusy={isBusy}
          />
          */}
        </>
      )}

      {isLanguageOpen && (
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
                  key={`currencies-${lang._id}`}
                  value={lang._id}
                  checked={chat?.language_code === lang._id}
                  onChange={(langCode) => { onChangeLanguage(langCode as TLanguageCode) }}
                />
                {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
              </div>
            ))}
          </div>
          {/*
          <Button
            isBottom
            text={t('apply')}
            onClick={() => { history.back() }}
            isBusy={isBusy}
          />
          */}
        </>
      )}
    </Screen>
  )
}

export default Settings
