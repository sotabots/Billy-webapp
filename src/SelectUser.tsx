import Divider from './kit/Divider'
import Header from './kit/Header'
import Screen from './kit/Screen'
import User from './kit/User'

import { generateUser } from './data'

function Select() {
  const users = [
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
    generateUser(),
  ]

  const onSelect = () => {
    // todo...
    history.back()
  }

  return (
    <Screen className="!bg-bg">
      <div className="limiter">
        <Header onBack={() => { history.back() }}  />
        <div className="px-4">
          <h2>Выберите человека</h2>
        </div>
        <div className="mt-4 overflow-y-auto">
          {users.map((user, i) => (
            <>
              <User key={`User-${i}`} {...user} onClick={onSelect} />
              {i < users.length - 1 && <Divider key={`Divider-${i}`} />}
            </>
          ))}
        </div>
      </div>
    </Screen>
  )
}

export default Select
