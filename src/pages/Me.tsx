import { useTranslation } from 'react-i18next'

import { useInit, useUser } from '../hooks'
import { Button, Header, Page, Panel } from '../kit'

export const Me = () => {
  useInit()

  const { t } = useTranslation()
  const { me } = useUser()

  return (
    <Page>
      <Header />

      <Panel>
        {me?.first_name} {me?.last_name}
        ...{t('')}
        <Button
          theme="clear"
          text={<>...</>}
          onClick={() => { /* */ }}
        />
      </Panel>

    </Page>
  )
}
