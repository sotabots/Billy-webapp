import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import User from '../kit/User'

import { useUsers } from '../hooks/useUsers'
import { useStore } from '../store'

function Select() {
  const { users, unrelatedUsers, selectUser, deleteUser } = useUsers()
  const { selectUserIndex } = useStore()

  const usersToShow = selectUserIndex !== null ? users : unrelatedUsers

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between">
        <h2 className="pt-[2px] pb-[6px]">Выберите человека</h2>
        {selectUserIndex !== null && (
          <Button
            theme="text"
            onClick={deleteUser(selectUserIndex)}
          >
            Удалить
          </Button>
        )}
      </div>

      <div className="mt-4 overflow-y-auto">
        {usersToShow.map((user, i, arr) => (
          <>
            <button className="w-full px-4 py-2 hover:bg-text/5 active:bg-text/10 transition-all" onClick={selectUser(user)}>
              <User user={user} />
            </button>
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default Select
