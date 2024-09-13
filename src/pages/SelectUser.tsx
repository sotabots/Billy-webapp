import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Page from '../kit/Page'
import { UsersGroup } from '../kit'

import { useStore, useFeedback, useInit, useTransaction, useUsers } from '../hooks'

import { TUser } from '../types'

function SelectUser() {
  useInit()

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { unrelatedUsers, relatedUsers, getUserById, addUsers, selectUser, deleteUser } = useUsers()
  const { selectPersonId, selectPersonIsPayer, transaction } = useStore()
  const { feedback } = useFeedback()
  const { deduplicatedShares } = useTransaction()

  // todo: remove selectPersonId === null case

  const forName = selectPersonId !== null
    ? (transaction?.shares || []).find(share => share.person_id === selectPersonId)?.normalized_name
    : null

  const title = selectPersonId !== null
    ? (
      forName
        ? `${t('selectWhoIs')} "${forName === 'MESSAGE_AUTHOR' ? t('author') : forName}"`
        : t('selectUser')
      )
    : t('addUser')

  const prevUserId = selectPersonId !== null
    ? (transaction?.shares || []).find(share => share.person_id === selectPersonId && share.related_user_id)?.related_user_id
    : null
  const prevUser = prevUserId && getUserById(prevUserId) || null

  const onClickUser = (user: TUser) => {
    if (selectPersonId !== null) {
      feedback('set_user_expnames_web', {
        user_prev: prevUser?._id || null,
        user_set: user._id,
      })
      selectUser(user)
    } else {
      feedback('set_users_expnames_web', {
        num_users_set: deduplicatedShares.length + 1,
      })
      addUsers([user])
    }
  }

  if (selectPersonId === null) {
    navigate(-1)
    return null
  }

  return (
    <Page className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="mb-2 px-4 flex items-center justify-between gap-3">
        <h2 className="pt-[2px] pb-[6px]">{title}</h2>
          <Button
            theme="text"
            text={t('delete')}
            onClick={() => {
              deleteUser(selectPersonId, selectPersonIsPayer)
              feedback('delete_user_expnames_web', {
                num_users_set: deduplicatedShares.length - 1,
              })
            }}
          />
      </div>

      <div className="pb-8 flex flex-col gap-4">
        {unrelatedUsers.length > 0 &&
          <UsersGroup
            title={t('notSelectedUsers')}
            users={unrelatedUsers}
            onClick={onClickUser}
          />
        }
        {relatedUsers.length > 0 &&
          <UsersGroup
            title={t('selectedUsers')}
            users={relatedUsers}
            onClick={onClickUser}
          />
        }
      </div>
    </Page>
  )
}

export default SelectUser
