import { MouseEventHandler } from 'react'
import Header from './kit/Header'
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
    <div className="fixed top-0 left-0 w-full h-full bg-bg">
      <div className="limiter">
        <Header onBack={onBack} />
        <div className="px-4">
          <h2>Выберите человека</h2>
        </div>
        <div className="mt-4 overflow-y-auto">
          {users.map((user, i) => (
            <>
              <User key={user.id} {...user} onClick={onBack} />
              {i < users.length - 1 && <div className="h-[1px] -my-[0.5px] mx-4 bg-[#E5E9EB]" />}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Select
