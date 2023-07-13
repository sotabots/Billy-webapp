import { MouseEventHandler, useState, useCallback } from 'react'
import Button from './kit/Button'
import Header from './kit/Header'
import UserAmount from './kit/UserAmount'
import Panel from './kit/Panel'
import Screen from './kit/Screen'

import { generateUserAmount } from './data'
import { TCurrency } from './types'

type TCheck = {
  currency: TCurrency
  onBack: MouseEventHandler<HTMLButtonElement>
  onSelectCurrency: MouseEventHandler<HTMLButtonElement>
}

function Check({ currency, onBack, onSelectCurrency }: TCheck) {
  const [data, setData] = useState([
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: false }),
    generateUserAmount({ isPayed: false }),
  ])

  const onChangeAmount = useCallback((id: number, amount: number) => {
    const newData = [...data]
    const foundIndex = newData.findIndex(item => item.id === id)
    newData[foundIndex].amount = amount
    setData(newData)
  }, [data, setData])

  const save = () => {
    alert('save & close webapp...')
  }

  return (
    <Screen>
      <div className="limiter">
        <Header onBack={onBack} />

        <div className="mb-2 px-4 flex items-center justify-between">
          <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
          <button className="h-8 text-[14px] leading-[24px] text-button hover:brightness-[1.2] active:brightness-[1.4] transition-all" onClick={onSelectCurrency}>{currency.in}</button>
        </div>

        <Panel className="!pb-4">
          <h3>Всё верно</h3>
          <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили 10 000 {currency.symbol}, должны 10 000 {currency.symbol}</div>
        </Panel>

        <Panel>
          <h3>Заплатили</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.filter(item => item.isPayed).map(userAmount => (
              <UserAmount key={userAmount.id} {...userAmount} onChange={(value) => { onChangeAmount(userAmount.id, value) }} />
            ))}
          </div>
        </Panel>

        <Panel>
          <h3>Должны</h3>
          <div className="mt-4 flex flex-col gap-3">
            {data.filter(item => !item.isPayed).map(userAmount => (
              <UserAmount key={userAmount.id} {...userAmount} onChange={(value) => { onChangeAmount(userAmount.id, value) }} />
            ))}
          </div>

          <div className="mt-8 py-2">
            <Button onClick={save}>Сохранить</Button>
          </div>
        </Panel>
      </div>
    </Screen>
  )
}

export default Check
