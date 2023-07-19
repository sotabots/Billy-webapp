import Divider from './kit/Divider'
import Header from './kit/Header'
import Screen from './kit/Screen'
import User from './kit/User'

import { useStore } from './store'
import { TUser } from './types'

function Select() {
  const { users } = useStore()
  const { userRelations, setUserRelations, selectUserIndex } = useStore()

  const onSelect = (user: TUser) => () => {
    if (selectUserIndex !== null) {
      // todo: replace
    } else { // add user
      setUserRelations([
        ...userRelations,
        { user }
      ])
    }
    history.back()
  }

  const usedUserIds = userRelations.map((item) => item.user?.id)
  const filteredUsers = users.filter(user => selectUserIndex ? true : !usedUserIds.includes(user.id))

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>Выберите человека {selectUserIndex}</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {filteredUsers.map((user, i, arr) => (
          <>
            <User key={`User-${i}`} {...user} onClick={onSelect(user)} />
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default Select
