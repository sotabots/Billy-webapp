import { MouseEventHandler } from 'react'
import { ReactComponent as Plus } from './img/plus.svg'
import Button from './kit/Button'
import Divider from './kit/Divider'
import Header from './kit/Header'
import Panel from './kit/Panel'
import Screen from './kit/Screen'
import UserRelation from './kit/UserRelation'

import { generateUserRelation } from './data'

type TStart = {
  onAdd: MouseEventHandler<HTMLButtonElement>
  onNext: MouseEventHandler<HTMLButtonElement>
}

function Start({ onAdd, onNext }: TStart) {
  const closeApp = () => {
    alert('close webapp...')
  }

  const userRelations = [
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation(),
    generateUserRelation()
  ]

  return (
    <Screen>
      <div className="limiter">
        <Header onCancel={closeApp} />
        <Panel>
          <div className="text-[12px] leading-[1.33em] font-medium text-hint">Сообщение</div>
          <div className="mt-1">
            🎙 <strong>Миша Двойняков</strong> заплатил 6 000 и <strong>Антон Костин</strong> заплатил 4 000, <strong>Настя</strong> должна 2 500, <strong>Маша</strong> должна 3 000, <strong>Ришат</strong> 1 000, <strong>Даша</strong> все остальное
          </div>
        </Panel>

        <Panel>
          <div>
            <h2>Соотнесите людей</h2>
            <div className="mt-1 text-[14px] leading-[20px] text-hint">Со временем мы запомним соотношения</div>
            <div className="mt-2 -mx-4 overflow-y-auto">
              {userRelations.map((userRelation, i) => (
                <div key={`UserRelation-Divider-${i}`}>
                  <UserRelation key={`UserRelation-${i}`} {...userRelation} onClick={onAdd} />
                  {i < userRelations.length - 1 && <Divider key={`Divider-${i}`} />}
                </div>
              ))}
            </div>
            <button className="mt-1 text-button h-8 w-full items-center flex gap-[9px] rounded-md hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onAdd}>
              <span className="h-6 w-6 flex items-center justify-center">
                <Plus />
              </span>
              <span>Добавить ещё</span>
            </button>
          </div>
          <div className="mt-8 py-2">
            <Button onClick={onNext}>Далее</Button>
          </div>
        </Panel>
      </div>
    </Screen>
  )
}

export default Start
