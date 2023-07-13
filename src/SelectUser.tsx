import { MouseEventHandler } from 'react'
import Divider from './kit/Divider'
import Header from './kit/Header'
import Screen from './kit/Screen'
import User from './kit/User'

import { generateUser } from './data'

type TSelect = {
  onBack: MouseEventHandler<HTMLButtonElement>
}

function Select({ onBack }: TSelect) {
  const users = [
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
  ]

  return (
    <Screen className="!bg-bg">
      <div className="limiter">
        <Header onBack={onBack} />
        <div className="px-4">
          <h2>Выберите человека</h2>
        </div>
        <div className="mt-4 overflow-y-auto">
          {users.map((user, i) => (
            <>
              <User key={`User-${i}`} {...user} onClick={onBack} />
              {i < users.length - 1 && <Divider key={`Divider-${i}`} />}
            </>
          ))}
        </div>
      </div>
    </Screen>
  )
}

export default Select
