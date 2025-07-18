import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useStore, useFeedback, useUsers, useTgSettings, useUser, usePostUserOnboarding, useAuth, useApiUrlInit } from '../hooks'


import i18n from '../i18n'
import { TPaywallSource, TUser } from '../types'

export const useInit = () => {
  useTgSettings()
  useApiUrlInit()

  const {
    flow, setFlow,
    isFlowFeedback, setIsFlowFeedback,
    isOnboardingFeedback, setIsOnboardingFeedback,
    chatIdStart, setChatIdStart,
    pwTxId, setPwTxId,
    txId, setTxId,
    transaction, setTransaction,
    isAuthorSharesInited, setIsAuthorSharesInited,
    paywallSource, setPaywallSource,
  } = useStore()
  const routerLocation = useLocation()
  const [initDataUnsafe/*, initData*/] = useInitData()
  const { users, getUserById } = useUsers()
  const { userLang } = useUser()
  const { userId } = useAuth()

  // init transaction/summary pages
  const queryParameters = new URLSearchParams(routerLocation.search)
  const queryTxId = queryParameters.get('txid')

  let startParam = initDataUnsafe.start_param

  if (!startParam) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const queryStartParam = queryParameters.get('start')
    if (queryStartParam) {
      startParam = queryStartParam
    }
  }

  let startParamTxId
  let startParamChatId
  let startParamRef: undefined | number
  let startParamPwTxId: undefined | string
  let startParamPaywallSource: TPaywallSource

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
      if ('chat_id' in startParamJson) {
        startParamChatId = startParamJson.chat_id
      }
      if ('pw_txid' in startParamJson) {
        startParamPwTxId = startParamJson.pw_txid
      }
      if ('paywall_source' in startParamJson) {
        startParamPaywallSource = startParamJson.paywall_source
      }
      console.log('start startParamTxId', startParamTxId)
    } catch {
      // fallback
      if (routerLocation.pathname.includes('/onboarding')) {
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

  if (chatIdStart === undefined && startParamChatId) {
    setChatIdStart(startParamChatId)
  }

  if (pwTxId === undefined && startParamPwTxId) {
    setPwTxId(startParamPwTxId)
  }

  if (paywallSource === undefined && startParamPaywallSource) {
    setPaywallSource(startParamPaywallSource)
  }

  if (!flow) {
    if (queryTxId || startParamTxId) {
      setFlow('transaction')
    }
    if (routerLocation.pathname.includes('/summary')) {
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
      transaction &&
      transaction.shares.length === 0 &&
      users.length
    ) {
      const user: TUser | null = userId && getUserById(userId)
        || getUserById(1000) // Demo Pavel shares
        || null

      if (user) {
        setIsAuthorSharesInited(true)
        setTransaction({
          ...transaction,
          creator_user_id: transaction.creator_user_id || user._id,
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
  }, [transaction, users, isAuthorSharesInited, setIsAuthorSharesInited, getUserById, setTransaction])

  // init language
  if (
    userLang &&
    userLang !== i18n.language &&
    i18n.languages.includes(userLang)
  ) {
    i18n.changeLanguage(userLang)
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
    if (!isOnboardingFeedback && routerLocation.pathname.includes('/onboarding')) {
      setIsOnboardingFeedback(true)
      feedback('onb_tool_started', {
        share_launch: !!startParamRef
      })
      if (startParamRef) {
        feedback('onb_started')
        feedback('onb_shared_user_launch')
        feedback('share_link_invitee_open', {
          distinct_id: startParamRef
        })
      }
      postUserOnboarding({
        ref: startParamRef
      })
    }
  }, [isOnboardingFeedback])
}
