import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import User from '../kit/User'

import { useInit, useUsers } from '../hooks'
import { useStore } from '../store'

function Select() {
  useInit()
  const { users, unrelatedUsers, addUsers, selectUser, deleteUser } = useUsers()
  const { selectPersonId, transaction } = useStore()

  const usersToShow = selectPersonId !== null ? users : unrelatedUsers
  const forName = selectPersonId !== null ? (transaction?.shares || []).find(share => share.person_id === selectPersonId)?.normalized_name : null
  const title = selectPersonId !== null
    ? (forName ? `Выберите, кто "${forName}"` : 'Выберите')
    : 'Добавить человека'

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between gap-3">
        <h2 className="pt-[2px] pb-[6px]">{title}</h2>
        {selectPersonId !== null && (
          <Button
            theme="text"
            text="Удалить"
            onClick={deleteUser(selectPersonId)}
          />
        )}
        {selectPersonId === null && usersToShow.length > 1 && (
          <Button
            theme="text"
            text="Добавить всех"
            onClick={addUsers(usersToShow)}
          />
        )}
      </div>

      <div className="mt-4 overflow-y-auto">
        {usersToShow.map((user, i, arr) => (
          <>
            <button className="w-full px-4 py-2 hover:bg-text/5 active:bg-text/10 transition-all" onClick={selectPersonId !== null ? selectUser(user) : addUsers([user])}>
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
