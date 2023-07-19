import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import Button from './kit/Button'
import Header from './kit/Header'
import UserAmount from './kit/UserAmount'
import Panel from './kit/Panel'
import Screen from './kit/Screen'

import { useStore } from './store'

function Check() {
  const navigate = useNavigate()
  const { currency, data, setData } = useStore()

  const onChangeAmount = (id: number, amount: number) => {
    const newData = [...data]
    const foundIndex = newData.findIndex(item => item.id === id)
    newData[foundIndex].amount = amount
    setData(newData)
  }

  const payedSum = data.filter(item => item.isPayed).reduce((acc, item) => acc + item.amount, 0)
  const oweSum = data.filter(item => !item.isPayed).reduce((acc, item) => acc + item.amount, 0)

  const isLacks = payedSum > oweSum
  const isOk = payedSum == oweSum
  const isOverdo = payedSum < oweSum

  const save = () => {
    alert('save & close webapp...')
  }

  return (
    <Screen>
      <Header onBack={() => { navigate('/') }}  />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
        <button
          className="h-8 text-[14px] leading-[24px] text-button hover:brightness-[1.2] active:brightness-[1.4] transition-all"
          onClick={() => { navigate('/select-currency') }}
        >
          {currency.in}
        </button>
      </div>

      <Panel className="!pb-4">
        <h3 className={cx(!isOk && 'text-error')}>
          {isLacks && 'Не хватает'}
          {isOk && 'Всё верно'}
          {isOverdo && 'Перебор'}
        </h3>
        <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили {payedSum} {currency.symbol}, должны {oweSum} {currency.symbol}</div>
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
          <Button onClick={save} disabled={!isOk}>Сохранить</Button>
        </div>
      </Panel>
    </Screen>
  )
}

export default Check
