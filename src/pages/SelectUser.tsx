import Divider from '../kit/Divider'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import User from '../kit/User'

import { useUsers } from '../hooks/useUsers'
import { useStore } from '../store'

function Select() {
  const { users, unrelatedUsers, selectUser } = useUsers()
  const { selectUserIndex } = useStore()

  const usersToShow = selectUserIndex !== null ? users : unrelatedUsers

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>Выберите человека</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {usersToShow.map((user, i, arr) => (
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
