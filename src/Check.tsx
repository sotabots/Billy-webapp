import { MouseEventHandler } from 'react'
import Button from './kit/Button'
import Header from './kit/Header'

type TCheck = {
  onBack: MouseEventHandler<HTMLButtonElement>
}

function Check({ onBack }: TCheck) {
  const save = () => {
    alert('save & close...')
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-bg2">
      <div className="limiter">
        <Header onBack={onBack} />

        <div className="mb-2 px-4">
          <h2 className="pt-[2px] pb-[6px]">Проверить траты</h2>
        </div>

        <div className="!pb-4 panel p-4 pb-6 rounded-3xl bg-bg">
          <h2>Всё верно</h2>
          <div className="mt-1 text-[14px] leading-[20px] text-hint">Заплатили 10 000 ₺, должны 10 000 ₺</div>
        </div>

        <div className="panel p-4 pb-6 rounded-3xl bg-bg">
          <h3>Заплатили</h3>
          <div className="mt-4 overflow-y-auto">
            ...
          </div>
        </div>

        <div className="panel p-4 pb-6 rounded-3xl bg-bg">
          <h3>Должны</h3>
          <div className="mt-4 overflow-y-auto">
            ...
          </div>

          <div className="mt-8 py-2">
            <Button onClick={save}>Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Check
