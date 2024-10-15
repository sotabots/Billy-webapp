import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { HTMLTagRenderer, Button, Panel, Textarea, CategoryAvatar } from '../kit'

import { useUser, useStore, useTransaction } from '../hooks'

export const MessagePanel = () => {
  const { t } = useTranslation()
  const { txComment, setTxComment } = useStore()
  const navigate = useNavigate()
  const { transaction, isEmptyTx } = useTransaction()
  const { isPro } = useUser()

  if (!transaction) {
    return null
  }

  return (
    <Panel className="MessagePanel flex flex-col gap-4 !pb-4">
      <div className="flex flex-col gap-1">
        {isEmptyTx && (
          <>
            <h3>{t('addComment')}</h3>
            <Textarea
              value={txComment}
              placeholder={t('yourComment')}
              onChange={setTxComment}
            />
          </>
        )}
        {!isEmptyTx && (
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
            theme="clear"
            className="group/button flex gap-3"
            text={(
              <>
                <h3>{t('category')}</h3>
                <CategoryAvatar tx={transaction} />
              </>
            )}
            onClick={() => {
              navigate('/select-category')
            }}
          />
        </div>
      }
    </Panel>
  )
}
