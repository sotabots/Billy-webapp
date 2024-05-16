import { useTranslation } from 'react-i18next'
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as Plus } from '../assets/plus.svg'
import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import MessagePanel from '../kit/MessagePanel'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import UserRelation from '../kit/UserRelation'

import { useFeedback, useInit, useUsers, useTransaction } from '../hooks'
import { useStore } from '../store'
import { closeApp } from '../utils'

function Match() {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSelectPersonId } = useStore()
  const { unrelatedUsers, countUnrelatedPersons, isRelationsComplete, isRelationsEnough, getUserById } = useUsers()
  const { transaction, deduplicatedShares, isEmptyTx } = useTransaction()
  const [impactOccurred] = useHapticFeedback()
  const { feedback } = useFeedback()

  if (!transaction) {
    return null
  }

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
    feedback('press_add_user_expnames_web', {
      num_users_prev: deduplicatedShares.length
    })
  }

  const isButtonDisabled = !isRelationsComplete || !isRelationsEnough
  const buttonText =
    !isRelationsComplete ? `🐨 ${t('pleaseMatchUsers')} (${countUnrelatedPersons})` :
    !isRelationsEnough ? `🐨 ${t('pleaseAddUsers')}` :
    t('next')

  return (
    <Screen>
      <Header onBack={closeApp} />

      <MessagePanel />

      <Panel>
        <div>
          <div className="flex items-start justify-between">
            <h2>{isEmptyTx ? t('addUsers') : t('matchUsers')}</h2>
            {!!unrelatedUsers.length && (
              <Button
                theme="clear"
                className="px-2 text-button h-6 items-center flex gap-[2px] font-semibold text-[14px] leading-6 hover:brightness-[1.2] active:brightness-[1.4] transition-all"
                text={
                  <>
                    <Plus className="h-6 w-6 flex items-center justify-center" />
                    <span className="whitespace-nowrap">{t('addMore')}</span>
                  </>
                }
                onClick={onAdd}
              />
            )}
          </div>
          {!isEmptyTx && (
            <div className="mt-1 text-[14px] leading-[20px] text-hint">🐨&nbsp;{t('willBeSaved')}</div>
          )}
          <div className="mt-2">
            {!!deduplicatedShares.length && (
              <div className="-mx-4 overflow-y-auto">
                {deduplicatedShares.map((share, i) => (
                  <div key={`UserRelation-Divider-${i}`}>
                    <UserRelation
                      key={`UserRelation-${i}`}
                      {...share}
                      onClick={() => {
                        feedback('press_change_user_expnames_web', {
                          user_prev: share.related_user_id && getUserById(share.related_user_id) || null
                        })
                        onSelect(share.person_id)
                      }}
                    />
                    {i < deduplicatedShares.length - 1 && <Divider key={`Divider-${i}`} />}
                  </div>
                ))}
              </div>
            )}
            {!deduplicatedShares.length && (
              <span className="opacity-40">{t('nobodyHere')}</span>
            )}
          </div>
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
