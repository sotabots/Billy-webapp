import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { HTMLTagRenderer, Button, Panel, Textarea, CategoryAvatar } from '../kit'

import { useUser, useStore, useTransaction } from '../hooks'

export const MessagePanel = () => {
  const { t } = useTranslation()
  const { /* txComment, setTxComment, */ setTransaction } = useStore()
  const navigate = useNavigate()
  const { transaction } = useTransaction()
  const { isPro } = useUser()

  if (!transaction) {
    return null
  }

  return (
    <Panel className="MessagePanel flex flex-col gap-4 !pb-4">
      <div className="flex flex-col gap-1">
        {/* {isEmptyTx && ( */ !null && (
          <>
            <h3>{t('message')}</h3>
            {/* <h3>{t('addComment')}</h3> */}
            <Textarea
              placeholder={t('addComment_')}
              // value={txComment}
              // onChange={setTxComment}
              value={transaction.raw_text}
              onChange={(text) => {
                setTransaction({
                  ...transaction,
                  raw_text: text,
                })
              }}
            />
          </>
        )}
        {!!null && (
          <>
            <h3>{t('message')}</h3>
            <div>
              {!!transaction.is_voice && (
                <span>🎙&nbsp;</span>
              )}
              {transaction.formatted_text ? (
                <HTMLTagRenderer allowedTags={['b', 'strong']} string={transaction.formatted_text} />
              ) : (
                <strong>{transaction.raw_text}</strong>
              )}
            </div>
          </>
        )}
      </div>
      {isPro &&
        <div>
          <Button
            className="group/button flex gap-3"
            onClick={() => {
              navigate('/select-category')
            }}
          >
            <>
              <h3>{t('category')}</h3>
              <CategoryAvatar tx={transaction} />
            </>
          </Button>
        </div>
      }
    </Panel>
  )
}
