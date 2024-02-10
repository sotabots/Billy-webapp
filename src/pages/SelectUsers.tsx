import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Divider from '../kit/Divider'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import UserButton from '../kit/UserButton'

import { useInit, useUsers } from '../hooks'
import { useStore } from '../store'
import { TShare, TUser } from '../types'

function SelectUsers() {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { users, /* unrelatedUsers, */ addUsers } = useUsers()
  const { isSelectPayer, transaction, setTransaction } = useStore()

  const usersToShow = /* selectPersonId !== null ? */ users // : unrelatedUsers
  // const forName = selectPersonId !== null ? (transaction?.shares || []).find(share => share.person_id === selectPersonId)?.normalized_name : null

  const isEveryoneChecked = true

  const checkEveryone = () => {
    if (Math.random() > 1) {
      addUsers(usersToShow) //
    }
  }
  const uncheckEveryone = () => {
    // addUsers(usersToShow)
  }

  const toggleUser = (user: TUser) => () => {
    console.log(user)
  }

  const save = () => {
    if (!transaction) {
      return
    }
    if (Math.random() > 1) {
      if (isSelectPayer) {
        // ...
      }
      const updShares: TShare[] = [
        ...transaction.shares,
        ...users.map(user => (
          {
            person_id: `added-person-user-${user._id}`, // todo: check
            raw_name: null, //user.first_name,
            normalized_name: null, // user.first_name,
            is_payer: false,
            amount: 0,
            user_candidates: null,
            related_user_id: user._id
          }
        ))
      ]
      if (transaction) {
        setTransaction({
          ...transaction,
          shares: updShares
        })
      }
    }

    navigate('/check')
  }

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between gap-3">
        <h2 className="pt-[2px] pb-[6px]">{isSelectPayer ? t('whoPaid') : t('forWhom')}</h2>
        <Button
          theme="text"
          text={isEveryoneChecked ? t('checkEveryone') : t('checkEveryone')}
          onClick={isEveryoneChecked ? uncheckEveryone : checkEveryone}
        />
      </div>

      <div className="mt-4 overflow-y-auto">
        {usersToShow.map((user, i, arr) => (
          <>
            <UserButton
              user={user}
              isChecked={true}
              onClick={toggleUser(user)}
            />
            {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>

      <Button
        isBottom
        text={t('apply')} // todo
        onClick={save}
      />
    </Screen>
  )
}

export default SelectUsers
