import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useBack, useCurrencies, useGetProfile, useInit, useLink, useStore, useUser } from '../hooks'
import { Button, Header, Page, Panel, Dropdown, Chat, Skeleton, Bottom } from '../kit'
import { formatAmount } from '../utils'

import { ReactComponent as GoIcon } from '../assets/go.svg'

export const Profile = () => {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { setSelectedChatId } = useStore()
  const { isPro } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useGetProfile()

  const { getCurrencyById } = useCurrencies()
  const currency = getCurrencyById(profile?.balance.currency_id || 'USD')
  const currencySymbol = currency?.symbol || '$'

  const { openLink, ADD_TO_CHAT_LINK } = useLink()

  type TDropdownValue = 'ALL' | 'ACTIVE' | 'SETTLED_UP'

  const dropdownItems: {
    text: string
    value: TDropdownValue
  }[] = [
    { text: t('profile.all'), value: 'ALL' },
    { text: t('profile.notSettledUp'), value: 'ACTIVE' },
    { text: t('profile.settledUp'), value: 'SETTLED_UP' },
  ]

  const [dropdownValue, setDropdownValue] = useState<TDropdownValue>(dropdownItems[0].value)

  const chats = (profile?.chats || []).filter(chat =>
    dropdownValue === 'ACTIVE' ? !chat.is_settled_up :
    dropdownValue === 'SETTLED_UP' ? chat.is_settled_up :
    true
  )

  const { goBack } = useBack()

  return (
    <Page>
      <Header />

      <Panel className="!p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[24px] leading-[32px] font-semibold">{t('profile.myBalance')}</div>
            {!profile &&
              <Skeleton w={70} h={32} />
            }
            {!!profile &&
              <>
                <div className={cx(
                  'text-[24px] leading-[32px] font-semibold',
                  profile?.balance.total && profile.balance.total > 0 && 'text-green',
                  profile?.balance.total && profile.balance.total < 0 && 'text-red',
                )}>
                  {!!profile?.balance.total && profile?.balance.total > 0 && '+'}
                  {formatAmount(profile?.balance.total || 0)}&nbsp;{currencySymbol}
                </div>
              </>
            }
          </div>

          <div className="flex items-stretch gap-4">
            <div className="w-[50%] rounded-[16px] bg-bg2 p-3">
              <div className="text-[14px] leading-[24px] font-semibold text-textSec">{t('profile.debts')}</div>
              {!profile &&
                <Skeleton w={50} h={24} />
              }
              {!!profile &&
                <div className="text-[16px] leading-[24px] font-bold">{formatAmount(profile.balance.debts || 0)}&nbsp;{currencySymbol}</div>
              }
            </div>
            <div className="w-[50%] rounded-[16px] bg-bg2 p-3">
              <div className="text-[14px] leading-[24px] font-semibold text-textSec">{t('profile.credits')}</div>
              {!profile &&
                <Skeleton w={50} h={24} />
              }
              {!!profile &&
                <div className="text-[16px] leading-[24px] font-bold">{formatAmount(profile?.balance.credits || 0)}&nbsp;{currencySymbol}</div>
              }
            </div>
          </div>

          {!isPro ? (
            <Button
              className="w-full min-h-[56px] rounded-[16px] p-4 pr-3 bg-pro flex items-center justify-between gap-2 text-textButton text-[16px] leading-[24px] font-semibold"
              onClick={() => { navigate('/paywall') }}
            >
              <span className="text-left">{t('profile.moreWithPro')}</span>
              <GoIcon className="w-6 h-6" />
            </Button>
          ) : (
            <div
              className="w-full min-h-[56px] rounded-[16px] p-4 pr-3 bg-bg2 flex items-center justify-between gap-2 text-[16px] leading-[24px] font-semibold"
            >
              <span className="text-left">{t('profile.proSub')}</span>
              <span className="rounded-full px-3 bg-pro text-textButton text-[14px] leading-[24px]">{t('profile.active')}</span>
              {/* <GoIcon className="w-6 h-6" /> */}
            </div>
          )}
        </div>
      </Panel>

      <Panel className="!p-4">
        <div className="flex flex-col gap-4 relative z-0">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[16px] leading-[24px] font-semibold">{t('profile.chats')}</div>
            <Dropdown
              items={dropdownItems}
              value={dropdownValue}
              onChange={(value: string) => { setDropdownValue(value as TDropdownValue) }}
            />
          </div>
          <div className="flex flex-col gap-4">
            {isProfileLoading && (
              <>
                <Chat key="Chat-loader-1" />
                <Chat key="Chat-loader-2" />
              </>
            )}
            {!isProfileLoading && chats.length > 0 && chats.map(chat => (
              <Chat
                key={chat.id}
                chat={chat}
                onClick={() => {
                  setSelectedChatId(chat.id)

                  if (goBack) {
                    goBack()
                  } else {
                    navigate('/summary')
                  }
                }}
              />
            ))}
            {!isProfileLoading && chats.length === 0 &&
              <div className="text-[14px] leading-[24px] text-textSec">{t('profile.noChats')}</div>
            }
          </div>
        </div>
      </Panel>

      <Bottom h={40}>
        <div className="flex items-center justify-center gap-[10px]">
          <Button
            wrapperClassName="w-full"
            className="w-full h-[40px] rounded-[6px] bg-separator text-blue text-[14px] font-semibold"
            onClick={() => { navigate('/user-settings') }}
          >
            {t('profile.settings')}
          </Button>
          <Button
            wrapperClassName="w-full w-full"
            className="w-full h-[40px] rounded-[6px] bg-blue text-textButton text-[14px] font-semibold"
            onClick={() => { openLink(ADD_TO_CHAT_LINK) }}
          >
            {t('profile.addChat')}
          </Button>
        </div>
      </Bottom>
    </Page>
  )
}
