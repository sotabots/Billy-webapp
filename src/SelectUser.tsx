import Divider from './kit/Divider'
import Header from './kit/Header'
import Screen from './kit/Screen'
import User from './kit/User'

import { useStore } from './store'
import { TUser } from './types'

function Select() {
  const { users } = useStore()
  const { userRelations, setUserRelations } = useStore()

  const onSelect = (user: TUser) => () => {
    setUserRelations([
      ...userRelations,
      { user }
    ])
    // todo: replace
    history.back()
  }

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>Выберите человека</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {users.map((user, i) => (
          <>
            <User key={`User-${i}`} {...user} onClick={onSelect(user)} />
            {i < users.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default Select
