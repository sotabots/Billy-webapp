import { useNavigate } from 'react-router-dom'

import { ReactComponent as Plus } from '../img/plus.svg'
import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import HTMLTagRenderer from '../kit/HTMLTagRenderer'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'
import UserRelation from '../kit/UserRelation'

import { useUsers } from '../hooks/useUsers'
import { useStore } from '../store'

function Start() {
  const navigate = useNavigate()
  const { transaction, setSelectUserIndex } = useStore()
  const { unrelatedUsers, isRelationsComplete } = useUsers()

  const onSelect = (i: number) => {
    setSelectUserIndex(i)
    navigate('/select-user')
  }

  const onAdd = () => {
    setSelectUserIndex(null)
    navigate('/select-user')
  }

  const closeApp = () => {
    alert('close webapp...')
  }

  return (
    <Screen>
      <Header onCancel={closeApp} />

      <Panel>
        <div className="text-[12px] leading-[1.33em] font-medium text-hint">Сообщение</div>
        <div className="mt-1">
          🎙 <HTMLTagRenderer allowedTags={['b', 'strong']} string={transaction.text} />
        </div>
      </Panel>

      <Panel>
        <div>
          <h2>Соотнесите людей</h2>
          <div className="mt-1 text-[14px] leading-[20px] text-hint">Со временем мы запомним соотношения</div>
          <div className="mt-2 -mx-4 overflow-y-auto">
            {transaction.parts.map((item, i) => (
              <div key={`UserRelation-Divider-${i}`}>
                <UserRelation
                  key={`UserRelation-${i}`}
                  {...item}
                  onClick={() => onSelect(i)}
                />
                {i < transaction.parts.length - 1 && <Divider key={`Divider-${i}`} />}
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
              <span>Добавить ещё</span>
            </button>
          )}
        </div>
        <div className="mt-8 py-2">
          <Button
            disabled={!isRelationsComplete}
            onClick={() => { navigate('/check') }}
          >
            Далее
          </Button>
        </div>
      </Panel>
    </Screen>
  )
}

export default Start
