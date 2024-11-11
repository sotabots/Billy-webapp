import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useCurrencies, useGetProfile, useInit, useUser } from '../hooks'
import { Button, Header, Page, Panel, Dropdown, Chat } from '../kit'

import { ReactComponent as Chevron } from '../assets/chevron.svg'
import { formatAmount } from '../utils'

export const Profile = () => {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPro } = useUser()
  const { data: profile, isLoading: isProfileLoading } = useGetProfile()

  const { getCurrencyById } = useCurrencies()
  const currency = getCurrencyById(profile?.balance.currency_id || 'USD')
  const currencySymbol = currency?.symbol || '$'

  const dropdownItems = [
    { text: t('profile.all'), value: 'ALL' },
    { text: t('profile.notSettledUp'), value: 'ACTIVE' },
    { text: t('profile.settledUp'), value: 'SETTLED_UP' },
  ]

  const [dropdownValue, setDropdownValue] = useState(dropdownItems[0].value)

  return (
    <Page>
      <Header />

      <Panel className="!p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[24px] leading-[32px] font-semibold">{t('profile.myBalance')}</div>
            <div className={cx(
              'text-[24px] leading-[32px] font-semibold',
              profile?.balance.total && profile.balance.total > 0 && 'text-green',
              profile?.balance.total && profile.balance.total < 0 && 'text-red',
            )}>
              {!!profile?.balance.total && profile?.balance.total > 0 && '+'}
              {formatAmount(profile?.balance.total || 0)}&nbsp;{currencySymbol}
            </div>
          </div>

          <div className="flex items-stretch gap-4">
            <div className="w-[50%] rounded-[16px] bg-bg2 p-3">
              <div className="text-[14px] leading-[24px] font-semibold text-textSec">{t('profile.debts')}</div>
              <div className="text-[16px] leading-[24px] font-bold">{formatAmount(profile?.balance.debts || 0)}&nbsp;{currencySymbol}</div>
            </div>
            <div className="w-[50%] rounded-[16px] bg-bg2 p-3">
              <div className="text-[14px] leading-[24px] font-semibold text-textSec">{t('profile.credits')}</div>
              <div className="text-[16px] leading-[24px] font-bold">{formatAmount(profile?.balance.credits || 0)}&nbsp;{currencySymbol}</div>
            </div>
          </div>

          {!isPro ? (
            <Button
              className="w-full min-h-[56px] rounded-[16px] p-4 pr-3 bg-pro flex items-center justify-between gap-2 text-textButton text-[16px] leading-[24px] font-semibold"
              onClick={() => { navigate('/paywall') }}
            >
              <span className="text-left">{t('profile.moreWithPro')}</span>
              <Chevron className="w-6 h-6" />
            </Button>
          ) : (
            <div
              className="w-full min-h-[56px] rounded-[16px] p-4 pr-3 bg-bg2 flex items-center justify-between gap-2 text-[16px] leading-[24px] font-semibold"
            >
              <span className="text-left">{t('profile.proSub')}</span>
              <span className="rounded-full px-3 bg-pro text-textButton text-[14px] leading-[24px]">{t('profile.active')}</span>
              {/* <Chevron className="w-6 h-6" /> */}
            </div>
          )}
        </div>
      </Panel>

      <Panel className="!p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[16px] leading-[24px] font-semibold">{t('profile.chats')}</div>
            {false &&
            <Dropdown
              items={dropdownItems}
              value={dropdownValue}
              onChange={setDropdownValue}
            />
            }
          </div>
          <div className="flex flex-col gap-4">
            {profile?.chats.map(chat => (
              <Chat key={chat.id} chat={chat} />
            ))}
            {!isProfileLoading && profile?.chats.length === 0 &&
              <div>{t('profile.noChats')}</div>
            }
          </div>
        </div>
      </Panel>
    </Page>
  )
}
