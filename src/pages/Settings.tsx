import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import Divider from '../kit/Divider'
import MenuItem from '../kit/MenuItem'
import MenuGroup from '../kit/MenuGroup'
import RadioButton from '../kit/RadioButton'

import { usePostChatCurrency, usePostChatLanguage, usePostChatSilent, useGetChat, usePostChatMonthlyLimit, usePostChatCashback } from '../api'
import { useChatId, useInit, useFeedback } from '../hooks'
import { useStore } from '../store'
import { TCurrencyId, TLanguageCode } from '../types'

import { ReactComponent as SettingsCurrencyIcon } from '../assets/settings-currency.svg'
import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'
import { ReactComponent as SettingsMessageIcon } from '../assets/settings-message.svg'
import { ReactComponent as SettingsCashbackIcon } from '../assets/settings-cashback.svg'
import { ReactComponent as SettingsLimitIcon } from '../assets/settings-limit.svg'

import { ReactComponent as ModePersonalIcon } from '../assets/mode-personal.svg'
import { ReactComponent as ModeGroupIcon } from '../assets/mode-group.svg'

function Settings() {
  useInit()

  const { t, i18n } = useTranslation()
  const { currencies, chat } = useStore()
  const { feedback } = useFeedback()

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isLimitOpen, setIsLimitOpen] = useState(false)
  const [isCashbackOpen, setIsCashbackOpen] = useState(false)

  const isInnerOpen = isCurrencyOpen || isLanguageOpen || isLimitOpen || isCashbackOpen

  const closeInnerPages = () => {
    setIsCurrencyOpen(false)
    setIsLanguageOpen(false)
    setIsLimitOpen(false)
    setIsCashbackOpen(false)
  }

  const [monthlyLimit, setMonthlyLimit] = useState(chat?.monthly_limit || 0)
  const [cashback, setCashback] = useState(chat?.cashback || 0)

  const [isBusy, setBusy] = useState(false)

  const postChatCurrency = usePostChatCurrency()
  const postChatLanguage = usePostChatLanguage()
  const postChatSilent = usePostChatSilent()
  const postChatMonthlyLimit = usePostChatMonthlyLimit()
  const postChatCashback = usePostChatCashback()

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

  const toggleSilent = async () => {
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatSilent(!chat?.silent_mode)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
    }
    setBusy(false)
  }

  const saveMonthlyLimit = async () => {
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatMonthlyLimit(monthlyLimit)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
    }
    setBusy(false)
  }

  const saveCashback = async () => {
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatCashback(cashback)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
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
      <Header onBack={() => { isInnerOpen ? closeInnerPages() : history.back() }} />

      {!isInnerOpen && (
        <div className="p-4">
          <div className="text-center text-[18px] leading-[24px] font-semibold">{t('chatType')}</div>
          <div className="mt-2 text-center text-[14px] leading-[20px]">{t('chatTypeDescription')}</div>

          <div className="mt-3 flex items-center p-1 rounded-[12px] bg-bg">
            <div className="flex flex-grow basis-0">
              <Button
                theme="clear"
                wrapperClassName="w-full"
                className={cx(
                  'w-full flex items-center justify-center gap-[2px] p-2 rounded-[8px]',
                  Math.random() > 0 ? 'bg-text/5' : 'text-text/70',
                )}
                text={
                  <>
                    <ModePersonalIcon className="h-6 w-6" />
                    <span>{t('personalExpenses')}</span>
                  </>
                }
                onClick={() => { /* */ }}
              />
            </div>
            <div className="flex flex-grow basis-0">
              <Button
                theme="clear"
                wrapperClassName="w-full"
                className={cx(
                  'w-full flex items-center justify-center gap-[2px] p-2 rounded-[8px]',
                  Math.random() < 0 ? 'bg-text/5' : 'text-text/70',
                )}
                text={
                  <>
                    <ModeGroupIcon className="h-6 w-6" />
                    <span>{t('splittingBills')}</span>
                  </>
                }
                onClick={() => { /* */ }}
              />
            </div>
          </div>


          <MenuGroup className="mt-5">
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
            <Divider className="mr-0 !bg-[#D5DADD]" />
            <MenuItem
              icon={<SettingsLimitIcon />}
              title={t('monthlyLimit')}
              value={t('setLimit')}
              onClick={() => { setIsLimitOpen(true) }}
            />
            <Divider className="mr-0 !bg-[#D5DADD]" />
            <MenuItem
              icon={<SettingsCashbackIcon />}
              title={t('cashback')}
              value={t('setCashback')}
              onClick={() => { setIsCashbackOpen(true) }}
            />
          </MenuGroup>

          <MenuGroup className="mt-4">
            <MenuItem
              icon={<SettingsMessageIcon />}
              title={`${!chat?.is_admin ? (t('forAdmin') + ' ') : ''}${t('leaveMessages')}`}
              isEnabled={!chat?.silent_mode}
              disabled={!chat?.is_admin}
              onClick={toggleSilent}
            />
          </MenuGroup>

          <Button
            isBottom
            text={t('close')}
            onClick={() => { history.back() }}
          />
        </div>
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

      {isLimitOpen && (
        <>
          <div className="px-4">
            {t('setMonthlyMaximum')}
          </div>
          <div className="mt-4 overflow-y-auto">
            <input
              value={monthlyLimit}
              onChange={(e) => { setMonthlyLimit(Number(e.target.value)) }}
            />
          </div>
          <Button
            isBottom
            text={t('apply')}
            onClick={() => { saveMonthlyLimit() }}
            isBusy={isBusy}
          />
        </>
      )}

      {isCashbackOpen && (
        <>
          <div className="px-4">
            {t('setMonthlyMaximum')}
          </div>
          <div className="mt-4 overflow-y-auto">
          <input
              value={monthlyLimit}
              onChange={(e) => { setCashback(Number(e.target.value)) }}
            />
          </div>
          <Button
            isBottom
            text={t('apply')}
            onClick={() => { saveCashback() }}
            isBusy={isBusy}
          />
        </>
      )}
    </Screen>
  )
}

export default Settings
