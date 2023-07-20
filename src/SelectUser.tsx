import Divider from './kit/Divider'
import Header from './kit/Header'
import Screen from './kit/Screen'
import User from './kit/User'

import { useUsers } from './hooks/useUsers'

function Select() {
  const { unrelatedUsers, selectUser } = useUsers()

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>Выберите человека</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {unrelatedUsers.map((user, i, arr) => (
          <>
            <User key={`User-${i}`} {...user} onClick={selectUser(user)} />
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default Select
