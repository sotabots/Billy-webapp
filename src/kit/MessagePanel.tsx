import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import HTMLTagRenderer from '../kit/HTMLTagRenderer'
import Button from '../kit/Button'
import Panel from '../kit/Panel'
import Textarea from '../kit/Textarea'

import { useTransaction } from '../hooks'
import { useStore } from '../store'

import { ReactComponent as EditIcon } from '../assets/edit.svg'
import CategoryAvatar from './CategoryAvatar'

const MessagePanel = () => {
  const { t } = useTranslation()
  const { txComment, setTxComment } = useStore()
  const navigate = useNavigate()
  const { transaction, isEmptyTx } = useTransaction()

  if (!transaction) {
    return null
  }

  return (
    <Panel className="MessagePanel flex flex-col gap-4 !pb-4">
      <div className="flex flex-col gap-1">
        {isEmptyTx && (
          <>
            <h2>{t('addComment')}</h2>
            <Textarea
              value={txComment}
              placeholder={t('yourComment')}
              onChange={setTxComment}
            />
          </>
        )}
        {!isEmptyTx && (
          <>
            <div className="text-[12px] leading-[1.33em] font-medium text-hint">{t('message')}</div>
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
      <div>
        <Button
          theme="clear"
          className="group/button flex gap-2"
          text={(
            <>
              <CategoryAvatar tx={transaction} />
              <EditIcon className="opacity-40 text-text group-hover/button:opacity-70 group-active/button:opacity-100 transition-all" />
            </>
          )}
          onClick={() => {
            navigate('/select-category')
          }}
        />
      </div>
    </Panel>
  )
}

export default MessagePanel
