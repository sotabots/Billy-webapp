import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import Button from '../kit/Button'
import Header from '../kit/Header'
import UserAmount from '../kit/UserAmount'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'

import { useStore } from '../store'

function Check() {
  const navigate = useNavigate()
  const { currency, transaction, setTransaction } = useStore()

  const onChangeAmount = (id: number, amount: number) => {
    const newParts = [...transaction.parts]
    const foundIndex = newParts.findIndex(item => item.user?.id === id)
    newParts[foundIndex].amount = amount
    setTransaction({
      ...transaction,
      parts: newParts
    })
  }

  // todo: move out

  const payedSum = transaction.parts.filter(item => item.isPayed).reduce((acc, item) => acc + item.amount, 0)
  const oweSum = transaction.parts.filter(item => !item.isPayed).reduce((acc, item) => acc + item.amount, 0)

  const isLacks = payedSum > oweSum
  const isOk = payedSum == oweSum
  const isOverdo = payedSum < oweSum

  const payedParts = transaction.parts.filter(part => part.user && part.isPayed)
  const oweParts = transaction.parts.filter(part => part.user && !part.isPayed)

  const isEquallyOwe = oweParts.every(part => part.amount === oweParts[0].amount)

  const setEqually = () => {
    const newAmount = (payedSum / oweParts.length) // .toFixed(2) // todo: improve
    const newParts = [...transaction.parts]
    setTransaction({
      ...transaction,
      parts: newParts.map(part => part.isPayed ? part : ({
        ...part,
        amount: newAmount
      }))
    })
  }

  const save = () => {
    alert('save & close webapp...')
  }

  return (
    <Screen>
      <Header onBack={() => { navigate('/') }}  />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
        <Button
          theme="text"
          onClick={() => { navigate('/select-currency') }}
        >
          {currency?.in}
        </Button>
      </div>

      <Panel className="!pb-4">
        <h3 className={cx(!isOk && 'text-error')}>
          {isLacks && 'Не хватает'}
          {isOk && 'Всё верно'}
          {isOverdo && 'Перебор'}
        </h3>
        <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили {payedSum} {currency?.symbol}, должны {oweSum} {currency?.symbol}</div>
      </Panel>

      <Panel>
        <h3>Заплатили</h3>
        <div className="mt-4 flex flex-col gap-3">
          {!payedParts.length && <span className="opacity-40">(Пусто)</span>}
          {payedParts.map(part => (
            <UserAmount
              key={part.user!.id}
              {...part}
              onChange={(value) => {
                onChangeAmount(part.user!.id, value)
              }}
            />
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between">
          <h3>Должны</h3>
          {!!oweParts.length && (!isEquallyOwe || !isOk) && (
            <Button
              theme="text"
              onClick={setEqually}
            >
              Поровну
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {!oweParts.length && <span className="opacity-40">(Пусто)</span>}
          {oweParts.map(part => (
            <UserAmount
              key={part.user!.id}
              {...part}
              onChange={(value) => {
                onChangeAmount(part.user!.id, value)
              }}
            />
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
