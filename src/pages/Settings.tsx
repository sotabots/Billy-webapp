import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useStore, useInit, useFeedback, useCurrencies, useUser, useLink, usePostChatCurrency, usePostUserLanguage, usePostChatSilent, useGetChat, usePostChatMode, usePostChatMonthlyLimit, usePostChatCashback } from '../hooks'
import { Button, Divider, MenuItem, MenuGroup, RadioButton, InputAmount, Currencies, Switch } from '../kit'
import { TCurrencyId, TLanguageCode, TMode } from '../types'
import { formatAmount } from '../utils'

import { ReactComponent as SettingsCurrencyIcon } from '../assets/settings-currency.svg'
import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'
import { ReactComponent as SettingsMessageIcon } from '../assets/settings-message.svg'
import { ReactComponent as SettingsCashbackIcon } from '../assets/settings-cashback.svg'
import { ReactComponent as SettingsLimitIcon } from '../assets/settings-limit.svg'

import { ReactComponent as ModePersonalIcon } from '../assets/mode-personal.svg'
import { ReactComponent as ModeGroupIcon } from '../assets/mode-group.svg'
import { ReactComponent as ProBadge } from '../assets/pro-badge.svg'

export type TSettingsInner = null | 'currency' | 'language' | 'limit' | 'cashback'

export const Settings = ({ settingsInner, setSettingsInner }: {
  settingsInner: TSettingsInner
  setSettingsInner: (_: TSettingsInner) => void
}) => {
  useInit()

  const { t } = useTranslation()
  const { setPaywallSource, setPaywallFrom } = useStore()
  const { data: chat } = useGetChat()
  const { feedback } = useFeedback()
  const { isPro, userLang, refetchUser } = useUser()
  const navigate = useNavigate()
  const { openLink, ADD_TO_CHAT_LINK } = useLink()

  const [monthlyLimit, setMonthlyLimit] = useState(chat?.monthly_limit || 0)
  const [cashback, setCashback] = useState((chat?.cashback || 0) * 100)

  const [isBusy, setBusy] = useState(false)

  const postChatMode = usePostChatMode()
  const postChatCurrency = usePostChatCurrency()
  const postUserLanguage = usePostUserLanguage()
  const postChatSilent = usePostChatSilent()
  const postChatMonthlyLimit = usePostChatMonthlyLimit()
  const postChatCashback = usePostChatCashback()

  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const { refetch: refetchChat } = useGetChat()

  const saveMode = async (mode: TMode) => {
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatMode(mode)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
    }
    setBusy(false)
  }

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
      setSettingsInner(null)
    }
    setBusy(false)
  }

  const onChangeLanguage = async (languageCode: TLanguageCode) => {
    selectionChanged()
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postUserLanguage(languageCode)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      feedback('set_language_settings_web', {
        language_prev: userLang,
        language_set: languageCode,
      })
      refetchUser()
      setSettingsInner(null)
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
      setSettingsInner(null)
    }
    setBusy(false)
  }

  const saveCashback = async () => {
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      await postChatCashback(cashback / 100)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
      setSettingsInner(null)
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

  const { getCurrencyById } = useCurrencies()
  const chatCurrency = getCurrencyById(chat?.default_currency || 'USD')

  return (
    <>
      {!settingsInner && (
        <div className="px-4 pb-4">
          {!!chat && !chat.is_admin &&
            <div className="p-4 pb-5 pr-6 border border-[#F76659]/30 rounded-[6px] bg-[#F76659]/10">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="text-text text-[14px] leading-[24px] font-semibold">{t('makeBillyAdminTitle')}</div>
                  <div className="text-text/70 text-[14px] leading-[24px] ">
                    <div className="pl-4"><span className="-ml-3">•</span> {t('makeBillyAdminFeature1')}</div>
                    <div className="pl-4"><span className="-ml-3">•</span> {t('makeBillyAdminFeature2')}</div>
                    <div className="pl-4"><span className="-ml-3">•</span> {t('makeBillyAdminFeature3')}</div>
                  </div>
                </div>
                <Button
                  className="rounded-[6px] px-3 py-1 bg-[#F76659] text-[#F6F8F9] text-[14px] leading-[24px] font-semibold"
                  onClick={() => {
                    openLink(ADD_TO_CHAT_LINK)
                  }}
                >
                  {t('makeAdmin')}
                </Button>
              </div>
            </div>
          }

          {false &&
          <div className="my-4">
            <div className="text-center text-[18px] leading-[24px] font-semibold">{t('chatType')}</div>
            <div className="mt-2 text-center text-[14px] leading-[20px]">{t('chatTypeDescription')}</div>

            <Switch
              className="mt-3"
              items={[
                {
                  title: (
                    <>
                      <ModePersonalIcon className="h-6 w-6" />
                      <span>{t('personalExpenses')}</span>
                    </>
                  ),
                  value: 'family',
                },
                {
                  title: (
                    <>
                      <ModeGroupIcon className="h-6 w-6" />
                      <span>{t('splittingBills')}</span>
                    </>
                  ),
                  value: 'travel',
                }
              ]}
              value={chat?.mode}
              onChange={(mode: string) => { saveMode(mode as TMode) } }
              disabled={!chat}
            />
          </div>
          }

          <MenuGroup className="mt-5">
            <MenuItem
              icon={<SettingsCurrencyIcon />}
              title={t('currency')}
              value={chat?.default_currency || ''}
              onClick={() => {
                setSettingsInner('currency')
                feedback('press_currency_settings_web', {
                  currency_prev: chat?.default_currency,
                })
              }}
            />
            <Divider className="mr-0" />
            <MenuItem
              icon={<SettingsLanguageIcon />}
              title={t('language')}
              value={userLang
                ? (
                  langs.find(lang => lang._id === userLang)?.title ||
                  userLang.toUpperCase())
                : ''
              }
              onClick={() => {
                setSettingsInner('language')
                feedback('press_language_settings_web', {
                  language_prev: userLang,
                })
              }}
            />
            <Divider className="mr-0" />
            {null && !!chat && chat.mode === 'family' &&
              <MenuItem
                icon={<SettingsLimitIcon />}
                title={t('monthlyLimit')}
                value={chat?.monthly_limit ? `${formatAmount(chat.monthly_limit)}${chatCurrency?.symbol}` : t('setLimit')}
                badge={!isPro ? <ProBadge /> : undefined}
                onClick={() => {
                  if (isPro) {
                    setSettingsInner('limit')
                  } else {
                    setPaywallSource('monthly_limit')
                    setPaywallFrom('settings')
                    navigate('/paywall')
                  }
                  feedback('press_limit', {
                    is_pro: isPro,
                  })
                }}
              />
            }
            {/* {!!chat && chat.mode === 'travel' && */}
            {true &&
              <MenuItem
                icon={<SettingsCashbackIcon />}
                title={t('cashback')}
                value={cashback ? `${cashback}%` : t('setCashback')}
                badge={!isPro ? <ProBadge /> : undefined}
                onClick={() => {
                  if (isPro) {
                    setSettingsInner('cashback')
                  } else {
                    setPaywallSource('cashback')
                    setPaywallFrom('settings')
                    navigate('/paywall')
                  }
                  feedback('press_cashback', {
                    is_pro: isPro,
                  })
                }}
              />
            }
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
            value={chat?.default_currency}
            onChange={onChangeCurrency}
          />
          {/*
          <Button
            theme="bottom"
            onClick={() => { history.back() }}
            isBusy={isBusy}
          >
            {t('apply')}
          </Button>
          */}
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
          {/*
          <Button
            theme="bottom"
            onClick={() => { history.back() }}
            isBusy={isBusy}
          >
            {t('apply')}
          </Button>
          */}
        </>
      )}

      {settingsInner === 'limit' && (
        <>
          <div className="text-center mt-[140px]">
            <div className="px-4 text-[#84919A]">
              {t('setLimitTitle')}
            </div>
            <div className="mt-4">
              <InputAmount
                amount={monthlyLimit}
                onChange={setMonthlyLimit}
                decimals={0}
                unit={chatCurrency?.symbol}
              />
            </div>
          </div>
          <Button
            theme="bottom"
            onClick={() => { saveMonthlyLimit() }}
            isBusy={isBusy}
          >
            {t('apply')}
          </Button>
        </>
      )}

      {settingsInner === 'cashback' && (
        <>
          <div className="text-center mt-[140px]">
            <div className="px-4 text-[#84919A]">
              {t('setCashbackTitle')}
            </div>
            <div className="mt-4">
              <InputAmount
                amount={cashback}
                onChange={setCashback}
                decimals={0}
                max={50}
                unit={'%'}
              />
            </div>
          </div>
          <Button
            theme="bottom"
            onClick={() => { saveCashback() }}
            isBusy={isBusy}
          >
            {t('apply')}
          </Button>
        </>
      )}
    </>
  )
}
