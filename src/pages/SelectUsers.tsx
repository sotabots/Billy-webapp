import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useStore, useFeedback, useInit, useTransaction, useUsers } from '../hooks'
import { Button, Divider, Header, Page, UserButton } from '../kit'
import { TShare, TUserId, TUser } from '../types'

export const SelectUsers = () => {
  useInit()

  const { t } = useTranslation()

  const { users, updUsers } = useUsers()
  const { isSelectPayers, transaction } = useStore()
  const { payedShares, oweShares } = useTransaction()
  const { feedback } = useFeedback()

  // todo: isSelectPayers null

  const [checkedUserIds, setCheckedUserIds] = useState<TUserId[]>(
    (transaction?.shares || [] as TShare[])
      .filter(share => share.is_payer === isSelectPayers)
      .filter(share => share.related_user_id !== null)
      .map(share => share.related_user_id as number)
  )

  const isEveryoneChecked = checkedUserIds.length > 0 && users.every(user => checkedUserIds.includes(user._id))

  const selectAll = () => {
    setCheckedUserIds(users.map(user => user._id))
  }
  const unselectAll = () => {
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
    <Page className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between gap-3">
        <h2 className="pt-[2px] pb-[6px]">{isSelectPayers ? t('whoPaid') : t('forWhom')}</h2>
        <Button
          theme="text"
          text={isEveryoneChecked ? t('unselectAll') : t('selectAll')}
          onClick={isEveryoneChecked ? unselectAll : selectAll}
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
        onClick={() => {
          updUsers(checkedUserIds, isSelectPayers)
          if (isSelectPayers) {
            feedback('set_payers_expshares_web', {
              num_payers_prev: payedShares.length,
              num_payers_set: checkedUserIds.length,
            })
          } else {
            feedback('set_debtors_expshares_web', {
              num_debtors_prev: oweShares.length,
              num_debtors_set: checkedUserIds.length,
            })
          }
        }}
      />
    </Page>
  )
}
