import cx from 'classnames'
import { useNavigate } from 'react-router-dom'
import Button from '../kit/Button'
import Header from '../kit/Header'
import UserAmount from '../kit/UserAmount'
import Panel from '../kit/Panel'
import Screen from '../kit/Screen'

import { useStore } from '../store'
import { feedback, EVENT } from '../feedback'

function Check() {
  const navigate = useNavigate()
  const { currencies, transaction, setTransaction } = useStore()

  const currency = currencies.find(currency => currency.id === transaction.currency_id)

  const onChangeAmount = (id: number, amount: number) => {
    const newShares = [...transaction.shares]
    const foundIndex = newShares.findIndex(share => share.related_user_id === id)
    newShares[foundIndex].amount = amount
    setTransaction({
      ...transaction,
      shares: newShares
    })
  }

  // todo: move out

  const payedSum = transaction.shares.filter(item => item.is_payer).reduce((acc, item) => acc + item.amount, 0)
  const oweSum = transaction.shares.filter(item => !item.is_payer).reduce((acc, item) => acc + item.amount, 0)

  const isLacks = payedSum < oweSum
  const isOk = payedSum == oweSum
  const isOverdo = payedSum > oweSum

  const payedShares = transaction.shares.filter(share => share.related_user_id && share.is_payer)
  const oweShares = transaction.shares.filter(share => share.related_user_id && !share.is_payer)

  const isEquallyOwe = oweShares.every(share => share.amount === oweShares[0].amount)

  const setEqually = () => {
    const newAmount = (payedSum / oweShares.length) // .toFixed(2) // todo: improve
    const newShares = [...transaction.shares]
    setTransaction({
      ...transaction,
      shares: newShares.map(share => share.is_payer ? share : ({
        ...share,
        amount: newAmount
      }))
    })
  }

  const save = async () => {
    const confirmedTransaction = {
      ...transaction,
      shares_confirmed: true
    }
    await feedback(EVENT.SEND_TRANSACTION)
    alert(`patch transaction (see console), close webapp`)
    console.log(JSON.stringify(confirmedTransaction, null, 2))
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
          {currency ? currency.in : 'Выберите валюту'}
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
          {!payedShares.length && <span className="opacity-40">(Пусто)</span>}
          {payedShares.map(share => (
            <UserAmount
              key={share.related_user_id}
              {...share}
              onChange={(value) => {
                onChangeAmount(share.related_user_id!, value)
              }}
            />
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between">
          <h3>Должны</h3>
          {!!oweShares.length && (!isEquallyOwe || !isOk) && (
            <Button
              theme="text"
              onClick={setEqually}
            >
              Поровну
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {!oweShares.length && <span className="opacity-40">(Пусто)</span>}
          {oweShares.map(share => (
            <UserAmount
              key={share.related_user_id!}
              {...share}
              onChange={(value) => {
                onChangeAmount(share.related_user_id!, value)
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
