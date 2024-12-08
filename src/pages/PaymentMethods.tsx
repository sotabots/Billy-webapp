import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
// import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, useGetUserSettings, usePostUserSettings } from '../hooks'
import { MenuGroup, Page, Header, Button } from '../kit'

export const PaymentMethods = ({ page }: {
  page: 'all' | 'add' | 'edit'
}) => {
  useInit()

  const { t } = useTranslation()
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
            <h2 className="pt-3 pb-4">{t('paymentMethods.title')}</h2>
            <MenuGroup description={t('paymentMethods.cardsWalletsDescription')}>
              <div className="flex gap-4 items-center">
                <Button
                  onClick={() => { navigate('/payment-methods/add') }}
                >
                  {t('add')}
                </Button>
              </div>
            </MenuGroup>
          </>
        }

        {page === 'add' &&
          <>
            <h2 className="pt-3 pb-4">{t('paymentMethods.addTitle')}</h2>
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
