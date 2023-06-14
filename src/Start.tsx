import { MouseEventHandler } from 'react'
import { ReactComponent as Plus } from './img/plus.svg'
import Button from './kit/Button'
import Header from './kit/Header'

type TStart = {
  onAdd: MouseEventHandler<HTMLButtonElement>
  onNext: MouseEventHandler<HTMLButtonElement>
}

function Start({ onAdd, onNext }: TStart) {
  const closeApp = () => {
    alert('close not implemented')
  }

  return (
    <>
      <Header onCancel={closeApp} />
      <div className="panel p-4 pb-6 rounded-3xl bg-bg">
        <div className="text-[12px] leading-[1.33em] font-medium text-hint">Сообщение</div>
        <div className="mt-1">
          🎙 <strong>Миша Двойняков</strong> заплатил 6 000 и <strong>Антон Костин</strong> заплатил 4 000, <strong>Настя</strong> должна 2 500, <strong>Маша</strong> должна 3 000, <strong>Ришат</strong> 1 000 <strong>Даша</strong>, все остальное
        </div>
      </div>

      <div className="panel p-4 pb-6 rounded-3xl bg-bg">
        <div>
          <h2>Соотнесите людей</h2>
          <div className="mt-1 text-[14px] leading-[20px] text-hint">Со временем мы запомним соотношения</div>
          <div className="mt-4 overflow-y-auto">

          </div>
          <button className="text-button h-8 w-full items-center flex gap-[9px] rounded-md" onClick={onAdd}>
            <span className="h-6 w-6 flex items-center justify-center">
              <Plus />
            </span>
            <span>Добавить ещё</span>
          </button>
        </div>
        <div className="mt-8 py-2">
          <Button onClick={onNext}>Далее</Button>
        </div>
      </div>
    </>
  )
}

export default Start
