import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { usePostUserOnboarding } from '../api'
import { useStore } from '../store'
import { useFeedback, useUsers, useTgSettings } from '../hooks'


import i18n from '../i18n'

export const useInit = () => {
  useTgSettings()

  const {
    flow, setFlow,
    isFlowFeedback, setIsFlowFeedback,
    isOnboardingFeedback, setIsOnboardingFeedback,
    chatIdStart, setChatIdStart,
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

  let startParam = initDataUnsafe.start_param

  if (!startParam) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const queryStartParam = queryParameters.get('start')
    if (queryStartParam) {
      startParam = queryStartParam
    }
  }

  let startParamTxId
  let startParamSummaryId
  let startParamChatId
  let startParamRef: undefined | number

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
      if ('chat_id' in startParamJson) {
        startParamChatId = startParamJson.chat_id
      }
      console.log('start startParamTxId', startParamTxId)
      console.log('start startParamSummaryId', startParamSummaryId)
    } catch {
      // fallback
      if (routerLocation.pathname === '/summary' || routerLocation.pathname === '/balance') {
        startParamSummaryId = startParam
      } else if (routerLocation.pathname === '/onboarding') {
        try {
          startParamRef = parseInt(startParam)
        } catch (e) {
          console.error(e)
        }
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

  if (chatIdStart === undefined && startParamChatId) {
    setChatIdStart(startParamChatId)
  }

  if (!flow) {
    if (queryTxId || startParamTxId) {
      setFlow('transaction')
    }
    if (querySummaryId || startParamSummaryId) {
      setFlow('summary')
    }
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
      const user = userId && getUserById(userId)
        || getUserById(1000) // Demo Pavel shares
        || null
      if (user) {
        setIsAuthorSharesInited(true)
        setTransaction({
          ...transaction,
          creator_user_id: transaction.creator_user_id || userId,
          shares: [true/*, false*/].map(isPayer => (
            {
              person_id: `author-person-user-${user._id}`,
              raw_name: null,
              normalized_name: null,
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

  // feedback page
  const { feedback } = useFeedback()

  useEffect(() => {
    if (!isFlowFeedback && flow === 'transaction' && transaction) {
      setIsFlowFeedback(true)
      feedback('open_page_transaction_web')
    }
    if (!isFlowFeedback && flow === 'summary') {
      setIsFlowFeedback(true)
      feedback('open_page_summary_web')
    }
  }, [flow, isFlowFeedback, setIsFlowFeedback, transaction])


  // onboarding
  const postUserOnboarding = usePostUserOnboarding()

  useEffect(() => {
    if (!isOnboardingFeedback) {
      setIsOnboardingFeedback(true)
      feedback('onb_tool_started')
      if (startParamRef) {
        feedback('onb_shared_user_launch')
      }
      postUserOnboarding({
        ref: startParamRef
      })
    }
  }, [isOnboardingFeedback])
}
