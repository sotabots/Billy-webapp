import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useStore } from '../store'
import { useChatId, useFeedback, useUsers, useTgSettings } from '../hooks'

import i18n from '../i18n'

export const useInit = () => {
  useTgSettings()

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

  if (startParam) {
    try {
      console.log('start startParam', startParam)
      const startParamReplaced = startParam
        .split('-').join('+')
        .split('_').join('/')
      console.log('start startParamReplaced', startParamReplaced)
      const startParamJsonEncoded = atob(startParamReplaced)
      console.log('start startParamJsonEncoded', startParamJsonEncoded)
      const startParamJson = JSON.parse(startParamJsonEncoded)
      console.log('start startParamJson', startParamJson)

      if ('transaction_id' in startParamJson) {
        startParamTxId = startParamJson.transaction_id
      }
      if ('summary_id' in startParamJson) {
        startParamSummaryId = startParamJson.summary_id
      }
      console.log('start startParamTxId', startParamTxId)
      console.log('start startParamSummaryId', startParamSummaryId)
    } catch {
      // fallback
      if (routerLocation.pathname === '/summary' || routerLocation.pathname === '/balance') {
        startParamSummaryId = startParam
      } else {
        startParamTxId = startParam
      }
    }
  }

  if (txId === undefined) {
    setTxId(queryTxId || startParamTxId || 'demo-tx')
  }

  if (summaryId === undefined) {
    setSummaryId(querySummaryId || startParamSummaryId || 'demo-summary')
  }

  // init new-tx author shares
  useEffect(() => {
    if ( // skip case
      !isAuthorSharesInited &&
      transaction &&
      transaction._id !== '0' &&
      transaction.shares.length > 0
    ) {
      setIsAuthorSharesInited(true)
      return
    }

    if (
      !isAuthorSharesInited &&
      initDataUnsafe.user &&
      transaction &&
      transaction.shares.length === 0 &&
      users.length
    ) {
      const userId = initDataUnsafe.user.id
      const user = getUserById(userId)
      if (user) {
        setIsAuthorSharesInited(true)
        setTransaction({
          ...transaction,
          creator_user_id: transaction.creator_user_id || userId,
          shares: [true, false].map(isPayer => (
            {
              person_id: 'MESSAGE_AUTHOR',
              raw_name: null,
              normalized_name: 'MESSAGE_AUTHOR',
              is_payer: isPayer,
              amount: 0,
              related_user_id: user._id,
              is_fixed_amount: false,
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

  // feedback app and page
  const { chatId } = useChatId()
  const { feedback } = useFeedback()
  const [isFeedback, setIsFeedback] = useState(false)

  useEffect(() => {
    if (chatId !== undefined && !isFeedback) {
      // feedback('open_app_web')
      if (routerLocation.pathname === '/summary') {
        feedback('open_page_summary_web')
      }
      if (routerLocation.pathname === '/') {
        feedback('open_page_transaction_web')
      }
      setIsFeedback(true)
    }
  }, [chatId, isFeedback, setIsFeedback])
}
