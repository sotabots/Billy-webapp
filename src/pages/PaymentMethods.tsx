import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
// import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useGetUserSettings, usePostUserSettings } from '../hooks'
import { Panel, Page, Header, Button, Textarea, Switch, TSwitchItem } from '../kit'

import { ReactComponent as PlusIcon } from '../assets/plus.svg'

export const PayoffMethods = ({ page }: {
  page: 'all' | 'add' | 'edit'
}) => {
  useInit()

  const { t } = useTranslation()
  const { data: userSettings, refetch: refetchUserSettings } = useGetUserSettings()
  const postUserSettings = usePostUserSettings()

  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [/*isBusy*/, setBusy] = useState(false)

  const switchItems: TSwitchItem[] = [
    {
      title: t('payoffMethods.card'),
      value: 'card',
    },
    {
      title: t('payoffMethods.crypto'),
      value: 'crypto',
    },
  ]
  const [switchItemValue, setSwitchItemValue] = useState<string>(switchItems[0].value)

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
      history.back()
    }
    setBusy(false)
  }

  return (
    <Page>
      <Header />

      <div className="px-4 pb-4">
        {page === 'all' &&
          <>
            <h2 className="pt-3 pb-4">{t('payoffMethods.title')}</h2>
            <Panel
              className="!p-4 -mx-4"
              description={t('payoffMethods.cardsWalletsDescription')}
            >
              <div className="flex gap-4 items-center justify-between">
                <h3 className="">{t('payoffMethods.cardsWallets')}</h3>
                <Button
                  className="flex items-center justify-center gap-[2px] px-2 text-blue"
                  onClick={() => { navigate('/payoff-methods/add') }}
                >
                  <PlusIcon className="w-6 h-6" />
                  <div className="text-[14px] leading-[24px] font-semibold">{t('add')}</div>
                </Button>
              </div>
            </Panel>
            <Panel
              className="!p-4 -mx-4"
              description={t('payoffMethods.messageDescription')}
            >
              <h3 className="mb-1">{t('payoffMethods.message')}</h3>
              <Textarea
                placeholder={t('payoffMethods.messagePlaceholder')}
                value={message}
                onChange={(message) => { setMessage(message) }}
              />
            </Panel>
          </>
        }

        {page === 'add' &&
          <>
            <h2 className="mb-2 pt-3 pb-2">{t('payoffMethods.addTitle')}</h2>

            <div className="flex flex-col gap-4">
              <Switch
                items={switchItems}
                value={switchItemValue}
                onChange={setSwitchItemValue}
              />
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
          </>
        }
      </div>

    </Page>
  )
}
