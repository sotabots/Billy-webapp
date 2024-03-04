import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'
import { useUsers } from '../hooks'

import i18n from '../i18n'

export const useInit = () => {
  const {
    txId, setTxId,
    summaryId, setSummaryId,
    chat,
    transaction, setTransaction,
    isAuthorSharesInited, setIsAuthorSharesInited,
  } = useStore()
  const routerLocation = useLocation()
  const [initDataUnsafe/*, initData*/] = useInitData()
  const { users, getUserById } = useUsers()

  // init transaction/summary pages
  const queryParameters = new URLSearchParams(routerLocation.search)
  const queryTxId = queryParameters.get('txid')
  const querySummaryId = queryParameters.get('summaryid')

  const startParam = initDataUnsafe.start_param
  // use `?startapp=...` as id
  // todo: decode
  let startParamTxId
  let startParamSummaryId

  if (routerLocation.pathname === '/summary') {
    startParamSummaryId = startParam
  } else {
    startParamTxId = startParam
  }

  if (txId === undefined) {
    setTxId(queryTxId || startParamTxId || null)
  }

  if (summaryId === undefined) {
    setSummaryId(querySummaryId || startParamSummaryId || null)
  }

  // init new-tx author shares
  useEffect(() => {
    if (
      !isAuthorSharesInited &&
      initDataUnsafe.user &&
      transaction &&
      transaction.creator_user_id === null &&
      transaction.shares.length === 0 &&
      users.length
    ) {
      const userId = initDataUnsafe.user.id
      const user = getUserById(userId)
      if (user) {
        setIsAuthorSharesInited(true)
        setTransaction({
          ...transaction,
          creator_user_id: userId,
          shares: [true, false].map(isPayer => (
            {
              person_id: 'MESSAGE_AUTHOR',
              raw_name: null,
              normalized_name: 'MESSAGE_AUTHOR',
              is_payer: isPayer,
              amount: 0,
              user_candidates: null,
              related_user_id: user._id
            }
          ))
        })
      }
    }
  }, [transaction, users, initDataUnsafe, isAuthorSharesInited, setIsAuthorSharesInited, getUserById, setTransaction])

  // init language
  if (
    chat?.language_code &&
    chat.language_code !== i18n.language &&
    i18n.languages.includes(chat.language_code)
  ) {
    i18n.changeLanguage(chat.language_code)
  }
}
