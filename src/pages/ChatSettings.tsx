import { useHapticFeedback, useShowPopup } from '@vkruglikov/react-telegram-web-app'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useStore, useInit, useFeedback, useUser, useLink, usePostChatCurrency, usePostChatLanguage, usePostChatSilent, useGetChat, usePostChatMode, usePostChatMonthlyLimit, usePostChatCashback, useUsers, usePostChatActiveUsers, useGetCurrencies, usePostChatPayFor } from '../hooks'
import { Button, Divider, MenuItem, MenuGroup, RadioButton, InputAmount, Currencies, Switch, UserButton, Panel, RateButton, CustomHeader } from '../kit'
import { TCurrencyId, TLanguageCode, TMode, TUser, TUserId } from '../types'
import { formatAmount } from '../utils'

import { ReactComponent as SettingsCurrencyIcon } from '../assets/settings-currency.svg'
import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'
import { ReactComponent as SettingsMessageIcon } from '../assets/settings-message.svg'
import { ReactComponent as SettingsCashbackIcon } from '../assets/settings-cashback.svg'
import { ReactComponent as SettingsLimitIcon } from '../assets/settings-limit.svg'
import { ReactComponent as SettingsRatesIcon } from '../assets/settings-rates.svg'
import { ReactComponent as SettingsUsersIcon } from '../assets/settings-users.svg'

import { ReactComponent as ModePersonalIcon } from '../assets/mode-personal.svg'
import { ReactComponent as ModeGroupIcon } from '../assets/mode-group.svg'
import { ReactComponent as ProBadge } from '../assets/pro-badge.svg'

export type TSettingsInner =
  null |
  'currency' |
  'language' |
  'limit' |
  'cashback' |
  'activeUsers' |
  'jointAccount' |
  'rates'

export const ChatSettings = ({ settingsInner, setSettingsInner }: {
  settingsInner: TSettingsInner
  setSettingsInner: (_: TSettingsInner) => void
}) => {
  useInit()

  const { t } = useTranslation()
  const showPopup = useShowPopup()
  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const { setPaywallSource, setPaywallFrom } = useStore()
  const { data: chat, refetch: refetchChat } = useGetChat()
  const { data: currencies } = useGetCurrencies()

  const { feedback } = useFeedback()
  const { isPro, me } = useUser()
  const { users, admins, refetchUsers } = useUsers()
  const navigate = useNavigate()
  const { openLink, ADD_TO_CHAT_LINK, SUPPORT_LINK } = useLink()

  const [monthlyLimit, setMonthlyLimit] = useState(chat?.monthly_limit || 0)
  const [cashback, setCashback] = useState((chat?.cashback || 0) * 100)

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

  const activeUserIds: TUserId[] = users.filter(user => user.is_active).map(user => user._id)
  const [checkedUserIds, setCheckedUserIds] = useState<TUserId[]>(activeUserIds)

  const currentPayeeUserId: TUserId | null = useMemo(() => {
    if (!me || !chat?.pay_for) return null
    const payeeIdsRaw = (chat.pay_for as unknown as Record<string, unknown>)[String(me._id)]
    if (!Array.isArray(payeeIdsRaw)) return null
    const normalized = payeeIdsRaw
      .map(v => (typeof v === 'number' ? v : Number.parseInt(String(v), 10)))
      .filter(v => Number.isFinite(v)) as TUserId[]
    return normalized[0] ?? null
  }, [chat?.pay_for, me])
  const [selectedPayeeUserId, setSelectedPayeeUserId] = useState<TUserId | null>(currentPayeeUserId)

  useEffect(() => {
    if (settingsInner === 'activeUsers') {
      setCheckedUserIds(activeUserIds)
    }
  }, [settingsInner])

  useEffect(() => {
    if (settingsInner !== 'jointAccount') return
    setSelectedPayeeUserId(currentPayeeUserId)
  }, [currentPayeeUserId, settingsInner])

  const isChangedActiveUsers = !(
    checkedUserIds.every(checkedUserId => activeUserIds.includes(checkedUserId)) &&
    activeUserIds.every(activeUserId => checkedUserIds.includes(activeUserId))
  )

  const isEveryoneChecked = checkedUserIds.length > 0 && users.every(user => checkedUserIds.includes(user._id))

  const selectAll = () => {
    setCheckedUserIds(users.map(user => user._id))
  }
  const unselectAll = () => {
    setCheckedUserIds([])
  }

  const toggleUser = (user: TUser) => () => {
    if (checkedUserIds.includes(user._id)) {
      setCheckedUserIds(checkedUserIds.filter(_ => _ !== user._id))
    } else {
      setCheckedUserIds([...checkedUserIds, user._id])
    }
  }

  const [isBusy, setBusy] = useState(false)

  const postChatMode = usePostChatMode()
  const postChatCurrency = usePostChatCurrency()
  const postChatLanguage = usePostChatLanguage()
  const postChatSilent = usePostChatSilent()
  const postChatMonthlyLimit = usePostChatMonthlyLimit()
  const postChatCashback = usePostChatCashback()
  const postChatActiveUsers = usePostChatActiveUsers()
  const postChatPayFor = usePostChatPayFor()

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
        currency_prev: chat?.last_used_currency_id,
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
      await postChatLanguage(languageCode)
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchChat()
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

  const saveActiveUsers = async () => {
    impactOccurred('medium')
    setBusy(true)
    try {
      await postChatActiveUsers(checkedUserIds)
      refetchUsers()
      setSettingsInner(null)
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const isChangedPayFor = selectedPayeeUserId !== currentPayeeUserId
  const savePayFor = async () => {
    if (!me) return
    setBusy(true)
    try {
      if (selectedPayeeUserId !== null) {
        await postChatPayFor({ payeeUserId: selectedPayeeUserId, isPaying: true })
      } else if (currentPayeeUserId !== null) {
        await postChatPayFor({ payeeUserId: currentPayeeUserId, isPaying: false })
      } else {
        setSettingsInner(null)
        return
      }
      refetchChat()
      setSettingsInner(null)
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {!settingsInner && (
        <div className="p-4 pt-0">
          {!!chat && !chat.is_admin &&
            <div className="p-4 pb-5 pr-6 border border-[#F76659]/30 rounded-[6px] bg-[#F76659]/10">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="text-text text-[14px] leading-[24px] font-semibold">{t('chatSettings.makeBillyAdminTitle')}</div>
                  <div className="text-text/70 text-[14px] leading-[24px] ">
                    <div className="pl-4"><span className="-ml-3">•</span> {t('chatSettings.makeBillyAdminFeature1')}</div>
                    <div className="pl-4"><span className="-ml-3">•</span> {t('chatSettings.makeBillyAdminFeature2')}</div>
                    <div className="pl-4"><span className="-ml-3">•</span> {t('chatSettings.makeBillyAdminFeature3')}</div>
                  </div>
                </div>
                <Button
                  className="rounded-[6px] px-3 py-1 bg-[#F76659] text-[#F6F8F9] text-[14px] leading-[24px] font-semibold"
                  onClick={() => {
                    if (!me) return
                    if (me.is_admin_in_this_chat) {
                      openLink(ADD_TO_CHAT_LINK)
                    } else {
                      const _message = (admins && admins?.length > 0)
                        ? [
                          t('chatSettings.usersCanMakeAdmin'),
                          ' ',
                          ...admins.map(admin => [
                            admin.first_name,
                            ...(admin.last_name ? [admin.last_name] : []),
                            ...(admin.username ? [`(@${admin.username})`] : []),
                          ].join(' ')),
                        ].join('\n')
                        : t('chatSettings.onlyAdmin')

                      const message = _message.length > 256
                        ? `${_message.slice(0, 255)}…`
                        : _message

                      showPopup({
                        title: t('chatSettings.makeAdmin'),
                        message,
                        buttons: [
                          {
                            id: 'ok',
                            text: t('ok'),
                            type: 'default',
                          },
                        ],
                      })
                    }
                  }}
                  disabled={!me}
                >
                  {t('chatSettings.makeAdmin')}
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
            {false &&
            <>
            <MenuItem
              icon={<SettingsCurrencyIcon />}
              title={t('currency')}
              value={false || ''} //
              onClick={() => {
                setSettingsInner('currency')
                feedback('press_currency_settings_web', {
                  currency_prev: undefined, // todo: remove
                })
              }}
            />
            <Divider className="mr-0" />
            </>
            }
            <MenuItem
              icon={<SettingsLanguageIcon />}
              title={t('chatSettings.language')}
              value={chat?.language_code
                ? (
                  langs.find(lang => lang._id === chat.language_code)?.title ||
                  chat.language_code.toUpperCase())
                : ''
              }
              onClick={() => {
                setSettingsInner('language')
              }}
            />
            <Divider className="mr-0" />
            {!!false && !!chat && chat.mode === 'family' &&
              <MenuItem
                icon={<SettingsLimitIcon />}
                title={t('monthlyLimit')}
                value={chat?.monthly_limit ? `${formatAmount(chat.monthly_limit)}${''/* todo: remove (currency) */}` : t('setLimit')}
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
              icon={<SettingsUsersIcon />}
              title={t('chatSettings.activeUsers')}
              value={`${activeUserIds.length}/${users.length}`}
              onClick={() => {
                setSettingsInner('activeUsers')
              }}
            />
            <Divider className="mr-0" />
            <MenuItem
              icon={<SettingsUsersIcon />}
              title={t('chatSettings.jointAccount')}
              value={
                currentPayeeUserId
                  ? (users.find(u => u._id === currentPayeeUserId)?.first_name || t('select'))
                  : t('select')
              }
              onClick={() => {
                setSettingsInner('jointAccount')
              }}
            />
          </MenuGroup>

          <MenuGroup className="mt-4">
            <MenuItem
              icon={<SettingsRatesIcon />}
              title={t('chatSettings.rates')}
              onClick={() => {
                setSettingsInner('rates')
              }}
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
            value={undefined} /* todo: remove */
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
                  checked={chat?.language_code === lang._id}
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
                unit={'' /* todo: remove (currency) */}
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

      {settingsInner === 'rates' && (
        <>
          <CustomHeader
            onBack={() => { setSettingsInner(null) }}
            center={t('chatSettings.ratesTitle')}
          />
          <div className="mb-4 px-4">
            <div className="text-[14px] leading-[20px] text-textSec2">
              <span>{t('chatSettings.ratesDescription')}</span>
              {' '}
              <Button
                wrapperClassName="!inline-block"
                className="!inline-block text-blue"
                onClick={() => { openLink(SUPPORT_LINK) }}
              >
                {t('chatSettings.contactSupport')}
              </Button>
              {' '}
              <span>{t('chatSettings.ratesDescription2')}</span>
            </div>
          </div>
          <Panel className="!px-0 !py-0 overflow-y-auto">
            {!!chat?.rates && !!currencies && currencies.filter(currency => currency._id !== 'USD' && (currencies.some(currency => currency.is_used_in_chat) ? currency.is_used_in_chat : true)).map((currency, i, arr) => (
              <>
                <RateButton
                  key={`RateButton-${currency._id}-${i}`}
                  currency={currency}
                  rate={chat.rates[`USD${currency._id}`]}
                  /*
                  fromCurrencyAmount={{
                    amount: 1,
                    currency_id: 'USD'
                  }}
                  toCurrencyAmount={{
                    amount: 1,
                    currency_id: 'USD'
                  }}
                  */
                />
                {i < arr.length - 1 &&
                  <Divider key={`Divider-${currency._id}-${i}`} />
                }
              </>
            ))}
          </Panel>
          <Button
            theme="bottom"
            onClick={() => {
              setSettingsInner(null)
            }}
          >
            {t('goBack')}
          </Button>
        </>
      )}

      {settingsInner === 'activeUsers' && (
        <>
          <div className="px-4 mt-3">
            <h2>{t('chatSettings.activeUsers')}</h2>
            <div className="mt-2 text-[14px] leading-[20px] text-textSec2">{t('chatSettings.activeUsersDescription')}</div>
          </div>
          <Panel className="mt-4 !px-0 overflow-y-auto">
            <div className="mb-2 px-4 flex items-center justify-between gap-3">
              <h3 className="">{t('chatSettings.chatMembers')}</h3>
              <Button
                theme="text"
                onClick={isEveryoneChecked ? unselectAll : selectAll}
              >
                {isEveryoneChecked ? t('unselectAll') : t('selectAll')}
              </Button>
            </div>
            <div>
              {users.map((user, i, arr) => (
                <>
                  <UserButton
                    key={`UserButton-${i}`}
                    user={user}
                    isChecked={checkedUserIds.includes(user._id)}
                    onClick={toggleUser(user)}
                  />
                  {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
                </>
              ))}
            </div>
          </Panel>
          <Button
            theme="bottom"
            onClick={() => {
              if (isChangedActiveUsers) {
                saveActiveUsers()
              } else {
                setSettingsInner(null)
              }
            }}
            isBusy={isBusy}
          >
            {isChangedActiveUsers ? t('save') : t('close')}
          </Button>
        </>
      )}

      {settingsInner === 'jointAccount' && (
        <>
          <div className="px-4 mt-3">
            <h2>{t('chatSettings.jointAccount')}</h2>
            <div className="mt-2 text-[14px] leading-[20px] text-textSec2 whitespace-pre-line">
              {t('chatSettings.jointAccountDescription')}
            </div>
          </div>
          <Panel className="mt-4 !px-0 overflow-y-auto">
            <div className="mb-2 px-4 flex items-center justify-between gap-3">
              <h3 className="">{t('chatSettings.chatMembers')}</h3>
            </div>
            <div>
              {(me ? users.filter(user => user._id !== me._id) : users).map((user, i, arr) => {
                const isChecked = selectedPayeeUserId === user._id
                const isDisabled = selectedPayeeUserId !== null && !isChecked

                return (
                  <>
                    <UserButton
                      key={`UserButton-payfor-${user._id}`}
                      user={user}
                      isChecked={isChecked}
                      disabled={isDisabled}
                      onClick={() => {
                        setSelectedPayeeUserId(prev => (prev === user._id ? null : user._id))
                      }}
                    />
                    {i < arr.length - 1 && <Divider key={`Divider-payfor-${user._id}`} />}
                  </>
                )
              })}
            </div>
          </Panel>
          <Button
            theme="bottom"
            onClick={() => {
              if (isChangedPayFor) {
                savePayFor()
              } else {
                setSettingsInner(null)
              }
            }}
            isBusy={isBusy}
          >
            {isChangedPayFor ? t('chatSettings.confirmJointAccount') : t('close')}
          </Button>
        </>
      )}

    </>
  )
}
