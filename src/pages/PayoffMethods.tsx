import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
// import cx from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useInit, /*usePostUserSettings, */ useGetAllPayoffMethods, useGetMyPayoffMethods, usePostMyPayoffMethods } from '../hooks'
import { Panel, Page, Header, Button, Textarea, Switch, TSwitchItem, PayoffMethod, InputText, Select, TSelectItem } from '../kit'

import { ReactComponent as PlusIcon } from '../assets/plus.svg'
import { Field } from '../kit/Field'

export const PayoffMethods = ({ page }: {
  page: 'all' | 'add' | 'edit'
}) => {
  useInit()

  const { t } = useTranslation()
  const { data: allPayoffMethods /*, refetch: refetchUserSettings */ } = useGetAllPayoffMethods()
  const { data: myPayoffMethods, refetch: refetchMyPayoffMethods } = useGetMyPayoffMethods()
  const postMyPayoffMethods = usePostMyPayoffMethods()

  const navigate = useNavigate()

  const [message, setMessage] = useState('')
  const [/*isBusy*/, setBusy] = useState(false)

  const switchItems: TSwitchItem[] = [
    {
      title: t('payoffMethods.card'),
      value: 'bank',
    },
    {
      title: t('payoffMethods.crypto'),
      value: 'crypto',
    },
  ]
  const [switchItemValue, setSwitchItemValue] = useState<string>(switchItems[0].value)

  const payoffMethodsFiltered: TSelectItem[] = Object.values(allPayoffMethods || {})
    .filter(_ => _.type === switchItemValue)
    .map(_ => ({
      value: _.type,
      title: _.title,
    }))

  const [selectValue, setSelectValue] = useState<string>('')

  const [demoText, setDemoText] = useState<string>('')

  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const onSave = async () => {
    if (!myPayoffMethods) {
      return
    }
    selectionChanged()
    impactOccurred('medium')
    setBusy(true)
    let isSuccess = true
    try {
      if (Math.random() < 0) { // todo
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore ...
        await postMyPayoffMethods(myPayoffMethods) // todo: fix
      }
    } catch {
      isSuccess = false
    }

    if (isSuccess) {
      refetchMyPayoffMethods()
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
                {!!myPayoffMethods && myPayoffMethods?.length === 0 &&
                  <Button
                    className="flex items-center justify-center gap-[2px] px-2 text-blue"
                    onClick={() => { navigate('/payoff-methods/add') }}
                  >
                    <PlusIcon className="w-6 h-6" />
                    <div className="text-[14px] leading-[24px] font-semibold">{t('add')}</div>
                  </Button>
                }
              </div>
              {!!myPayoffMethods && myPayoffMethods.length > 0 &&
                <>
                  <div className="mt-2 -mx-4">
                    {myPayoffMethods.map(myPayoffMethod =>
                      <PayoffMethod
                        key={myPayoffMethod.id}
                        userPayoffMethod={myPayoffMethod}
                        onClick={() => { /* */ }}
                      />
                    )}
                  </div>
                  <Button
                    wrapperClassName="mt-4"
                    className="w-full min-h-[40px] rounded-[6px] text-blue bg-separator text-[14px] leading-[24px]"
                    onClick={() => { navigate('/payoff-methods/add') }}
                  >
                    {t('payoffMethods.add_')}
                  </Button>
                </>
              }
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

            <Switch
              items={switchItems}
              value={switchItemValue}
              onChange={setSwitchItemValue}
            />

            <div className="mt-4 flex flex-col gap-4">
              <Field
                title={switchItemValue === 'bank' ? t('payoffMethods.bank') : t('payoffMethods.crypto')}
              >
                <Select
                  items={payoffMethodsFiltered}
                  value={selectValue}
                  onChange={setSelectValue}
                />
              </Field>
              <InputText
                placeholder={'Demo placeholder'}
                value={demoText}
                onChange={setDemoText}
              />
            </div>

            <Button
              theme="bottom"
              onClick={onSave}
            >
              {t('save')}
            </Button>
          </>
        }
      </div>

    </Page>
  )
}
