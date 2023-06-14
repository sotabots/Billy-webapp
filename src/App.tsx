import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import Check from './Check'
import Select from './Select'
import Start from './Start'

function App() {
  const [isSelectOpen, setSelectOpen] = useState(false)
  const [isCheckOpen, setCheckOpen] = useState(true)


  return (
    <>
      <Start
        onAdd={() => { setSelectOpen(true) }}
        onNext={() => { setCheckOpen(true) }}
      />

      {isSelectOpen && (
        <Select onBack={() => { setSelectOpen(false) }} />
      )}

      {isCheckOpen && (
        <>
          !!!
          <Check onBack={() => { setCheckOpen(false) }} />
        </>
      )}
    </>
  )
}

export default App
