import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-center h-[64px]">
        (header)
      </header>
      <div className="panel p-4 pb-6 rounded-3xl bg-white">
        <div className="text-[12px] leading-[1.33em] font-medium">Сообщение</div>
        <div className="mt-1">
          🎙 <strong>Миша Двойняков</strong> заплатил 6 000 и <strong>Антон Костин</strong> заплатил 4 000, <strong>Настя</strong> должна 2 500, <strong>Маша</strong> должна 3 000, <strong>Ришат</strong> 1 000 <strong>Даша</strong>, все остальное
        </div>
      </div>

      <div className="panel p-4 pb-6 rounded-3xl bg-white">
        <h2>Соотнесите людей</h2>
        <div className="mt-1 text-[14px] leading-[20px]">Со временем мы запомним соотношения</div>
        <div className="mt-4 overflow-y-auto">

        </div>
        <button className="text-[#4094F7] h-8 w-full text-left" onClick={() => setOpen(true)}>
          <span className="h-6 w-6"></span>
          <span>Добавить ещё</span>
        </button>
      </div>

      {isOpen && (
        <div className="">(bottom sheet)</div>
      )}
    </>
  )
}

export default App
