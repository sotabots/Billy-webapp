import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInit, useUser } from '../hooks'
import { Button, Header, Page, Panel, Dropdown } from '../kit'

export const Profile = () => {
  useInit()

  const { t } = useTranslation()
  const { me } = useUser()

  const dropdownItems = [
    { text: t('chats.all'), value: 'ALL' },
    { text: t('chats.active'), value: 'ACTIVE' },
    { text: t('chats.settledUp'), value: 'SETTLED_UP' },
  ]

  const [dropdownValue, setDropdownValue] = useState(dropdownItems[0].value)

  return (
    <Page>
      <Header />

      <Panel className="!p-4">
        <div className="text-[24px] leading-[32px] font-semibold">{t('me.myBalance')}</div>
        {me?.first_name} {me?.last_name}
        ...{t('')}
        <Button
          onClick={() => { /* */ }}
        >
          <>...</>
        </Button>
      </Panel>

      <Panel className="!p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[16px] leading-[24px] font-semibold">{t('me.chats')}</div>
            <Dropdown
              items={dropdownItems}
              value={dropdownValue}
              onChange={setDropdownValue}
            />
          </div>
          <div className="flex flex-col gap-4">
          </div>
        </div>
      </Panel>
    </Page>
  )
}
