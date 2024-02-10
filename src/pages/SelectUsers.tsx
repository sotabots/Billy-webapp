import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import UserButton from '../kit/UserButton'

import { useInit, useUsers } from '../hooks'
import { useStore } from '../store'
import { TShare, TUserId, TUser } from '../types'

function SelectUsers() {
  useInit()

  const { t } = useTranslation()

  const { users, updUsers } = useUsers()
  const { isSelectPayer, transaction } = useStore()

  // todo: isSelectPayer null

  const [checkedUserIds, setCheckedUserIds] = useState<TUserId[]>(
    (transaction?.shares || [] as TShare[])
      .filter(share => share.is_payer === isSelectPayer)
      .filter(share => share.related_user_id !== null)
      .map(share => share.related_user_id as number)
  )

  const isEveryoneChecked = checkedUserIds.length > 0 && users.every(user => checkedUserIds.includes(user._id))

  const checkEveryone = () => {
    setCheckedUserIds(users.map(user => user._id))
  }
  const uncheckEveryone = () => {
    setCheckedUserIds([])
  }

  const toggleUser = (user: TUser) => () => {
    if (checkedUserIds.includes(user._id)) {
      setCheckedUserIds(checkedUserIds.filter(_ => _ !== user._id))
    } else {
      setCheckedUserIds([...checkedUserIds, user._id])
    }
  }

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between gap-3">
        <h2 className="pt-[2px] pb-[6px]">{isSelectPayer ? t('whoPaid') : t('forWhom')}</h2>
        <Button
          theme="text"
          text={isEveryoneChecked ? t('uncheckEveryone') : t('checkEveryone')}
          onClick={isEveryoneChecked ? uncheckEveryone : checkEveryone}
        />
      </div>

      <div className="mt-4 overflow-y-auto">
        {users.map((user, i, arr) => (
          <>
            <UserButton
              key={i}
              user={user}
              isChecked={checkedUserIds.includes(user._id)}
              onClick={toggleUser(user)}
            />
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>

      <Button
        isBottom
        text={t('apply')} // todo
        onClick={updUsers(checkedUserIds, isSelectPayer)}
      />
    </Screen>
  )
}

export default SelectUsers
