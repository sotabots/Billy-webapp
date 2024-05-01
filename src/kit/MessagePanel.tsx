import { useTranslation } from 'react-i18next'

import HTMLTagRenderer from '../kit/HTMLTagRenderer'
import Panel from '../kit/Panel'
import Textarea from '../kit/Textarea'

import { useStore } from '../store'

const MessagePanel = () => {
  const { t } = useTranslation()
  const { transaction, txComment, setTxComment } = useStore()

  const isEmptyTx = !transaction?.formatted_text && !transaction?.raw_text

  return (
    <Panel className="MessagePanel flex flex-col gap-1 !pb-4">
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
    </Panel>
  )
}

export default MessagePanel
