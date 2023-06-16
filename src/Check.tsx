import { MouseEventHandler } from 'react'
import Button from './kit/Button'
import Header from './kit/Header'
import UserAmount from './kit/UserAmount'
import Panel from './kit/Panel'

import { generateUserAmount } from './data'

type TCheck = {
  onBack: MouseEventHandler<HTMLButtonElement>
  currency: string
  onSelectCurrency: MouseEventHandler<HTMLButtonElement>
}

function Check({ onBack, onSelectCurrency }: TCheck) {
  const save = () => {
    alert('save & close...')
  }

  const payed = [
    generateUserAmount(),
    generateUserAmount(),
  ]

  const owe = [
    generateUserAmount(),
    generateUserAmount(),
  ]

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-bg2">
      <div className="limiter">
        <Header onBack={onBack} />

        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
          <button className="h-8 text-[14px] leading-[24px] text-button" onClick={onSelectCurrency}>В рублях</button>
        </div>

        <Panel className="!pb-4">
          <h3>Всё верно</h3>
          <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили 10 000 ₺, должны 10 000 ₺</div>
        </Panel>

        <Panel>
          <h3>Заплатили</h3>
          <div className="mt-4 overflow-y-auto flex flex-col gap-3">
            {payed.map(userAmount => (
              <UserAmount key={userAmount.id} {...userAmount} />
            ))}
          </div>
        </Panel>

        <Panel>
          <h3>Должны</h3>
          <div className="mt-4 overflow-y-auto flex flex-col gap-3">
            {owe.map(userAmount => (
              <UserAmount key={userAmount.id} {...userAmount} />
            ))}
          </div>

          <div className="mt-8 py-2">
            <Button onClick={save}>Сохранить</Button>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default Check
