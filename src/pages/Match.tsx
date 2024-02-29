import { useTranslation } from 'react-i18next'
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as Plus } from '../assets/plus.svg'
import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import HTMLTagRenderer from '../kit/HTMLTagRenderer'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import UserRelation from '../kit/UserRelation'
import Textarea from '../kit/Textarea'

import { useInit, useUsers } from '../hooks'
import { useStore } from '../store'
import { TShare } from '../types'
import { closeApp } from '../utils'

function Match() {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { transaction, setSelectPersonId, txComment, setTxComment } = useStore()
  const { unrelatedUsers, isRelationsEnough, isRelationsComplete } = useUsers()
  const [impactOccurred] = useHapticFeedback()

  if (!transaction) {
    return null
  }

  const isEmptyTx = !transaction?.formatted_text && !transaction?.raw_text

  // deduplicate by person_id
  const deduplicatedShares = transaction.shares.reduce((acc, share) => {
    const prevPersonIds = acc.map(acc => acc.person_id)
    return share.person_id !== null && prevPersonIds.includes(share.person_id) ? acc : [...acc, share]
  }, [] as TShare[])

  const onSelect = (personId: string | null) => {
    if (personId === null) {
      return
    }
    setSelectPersonId(personId)
    console.log('onSelect vibro')
    impactOccurred('light')
    navigate('/select-user')
  }

  const onAdd = () => {
    setSelectPersonId(null)
    console.log('onAdd vibro')
    impactOccurred('light')
    navigate('/select-user')
  }

  const isButtonDisabled = !isRelationsComplete || !isRelationsEnough
  const buttonText =
    !isRelationsComplete ? `🐨 ${t('pleaseMatchUsers')}` :
    !isRelationsEnough ? `🐨 ${t('pleaseAddUsers')}` :
    t('next')

  return (
    <Screen>
      <Header onBack={closeApp} />

      <Panel className="flex flex-col gap-1">
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

      <Panel>
        <div>
          <h2>{isEmptyTx ? t('addUsers') : t('matchUsers')}</h2>
          {!isEmptyTx && (
            <div className="mt-1 text-[14px] leading-[20px] text-hint">🐨&nbsp;{t('willBeSaved')}</div>
          )}
          <div className="mt-2 -mx-4 overflow-y-auto">
            {deduplicatedShares.map((share, i) => (
              <div key={`UserRelation-Divider-${i}`}>
                <UserRelation
                  key={`UserRelation-${i}`}
                  {...share}
                  onClick={() => onSelect(share.person_id)}
                />
                {i < deduplicatedShares.length - 1 && <Divider key={`Divider-${i}`} />}
              </div>
            ))}
          </div>
          {!!unrelatedUsers.length && (
            <button
              className="mt-1 text-button h-8 w-full items-center flex gap-[9px] rounded-md hover:brightness-[1.2] active:brightness-[1.4] transition-all"
              onClick={onAdd}
            >
              <span className="h-6 w-6 flex items-center justify-center">
                <Plus />
              </span>
              <span>{t('addMore')}</span>
            </button>
          )}
        </div>
      </Panel>

      <Button
        isBottom
        text={buttonText}
        disabled={isButtonDisabled}
        onClick={() => { navigate('/check') }}
      />
    </Screen>
  )
}

export default Match
