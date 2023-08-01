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
          <button
            className="h-8 text-[14px] leading-[24px] text-button hover:brightness-[1.2] active:brightness-[1.4] transition-all"
            onClick={deleteUser(selectUserIndex)}
          >
            Удалить
          </button>
        )}
      </div>

      <div className="mt-4 overflow-y-auto">
        {usersToShow.map((user, i, arr) => (
          <>
            <User
              key={`User-${i}`}
              {...user}
              onClick={selectUser(user)}
            />
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default Select
