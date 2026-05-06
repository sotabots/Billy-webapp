import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStore, useFeedback, useUsers, useTgSettings, useUser, usePostUserOnboarding, useAuth, useApiUrlInit, useGetTransactionChatId } from '../hooks'


import i18n from '../i18n'
import { TDebtDeepLinkParams, TPaywallSource, TStartPayload, TUser } from '../types'
import { decodeStartParam, getTransactionEditPath } from '../utils'

const transactionInnerPaths = new Set([
  '/select-user',
  '/select-currency',
  '/select-users',
  '/select-category',
])

let handledStartParamRoute: string | undefined

const hasUnhandledStartParamRoute = (startParam?: string) =>
  !!startParam && handledStartParamRoute !== startParam

const markStartParamRouteHandled = (startParam?: string) => {
  if (startParam) {
    handledStartParamRoute = startParam
  }
}

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
    startBalanceUserId, setStartBalanceUserId,
    startBalanceDebt, setStartBalanceDebt,
  } = useStore()
  const routerLocation = useLocation()
  const navigate = useNavigate()
  const [initDataUnsafe/*, initData*/] = useInitData()
  const { users, getUserById } = useUsers()
  const { userLang } = useUser()
  const { userId } = useAuth()
  const isTransactionInnerPath = transactionInnerPaths.has(routerLocation.pathname)

  // init transaction/summary pages
  const routeQueryParameters = new URLSearchParams(routerLocation.search)
  const pageQueryParameters = new URLSearchParams(window.location.search)
  const queryTxId = routeQueryParameters.get('txid')
    || pageQueryParameters.get('txid')

  let startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param
    || initDataUnsafe.start_param

  if (!startParam) {
    const queryStartParam =
      routeQueryParameters.get('start') ||
      routeQueryParameters.get('tgWebAppStartParam') ||
      routeQueryParameters.get('startapp') ||
      routeQueryParameters.get('startApp') ||
      pageQueryParameters.get('start') ||
      pageQueryParameters.get('tgWebAppStartParam') ||
      pageQueryParameters.get('startapp') ||
      pageQueryParameters.get('startApp')
    if (queryStartParam) {
      startParam = queryStartParam
    }
  }

  let startParamTxId: undefined | string
  let startParamChatId: undefined | number
  let startParamBalanceUserId: undefined | number
  let startParamBalanceDebt: undefined | TDebtDeepLinkParams
  let startParamRef: undefined | number
  let startParamPwTxId: undefined | string
  let startParamPaywallSource: TPaywallSource
  let startParamScreen: TStartPayload['s']

  if (startParam) {
    try {
      console.log('start startParam', startParam)
      const startParamJson = decodeStartParam(startParam)
      console.log('start startParamJson', startParamJson)

      if (!startParamJson) {
        throw new Error('Empty start param')
      }
      if (typeof startParamJson.t === 'string') {
        startParamTxId = startParamJson.t
      }
      if (typeof startParamJson.c === 'number') {
        startParamChatId = startParamJson.c
      }
      if (typeof startParamJson.p === 'string') {
        startParamPaywallSource = startParamJson.p
      }
      if (
        startParamJson.s === 'profile' ||
        startParamJson.s === 'slide_prepaywall' ||
        startParamJson.s === 'onboarding' ||
        startParamJson.s === 'chat'
      ) {
        startParamScreen = startParamJson.s
      }

      if ('transaction_id' in startParamJson && typeof startParamJson.transaction_id === 'string') {
        startParamTxId = startParamJson.transaction_id
      }
      if ('chat_id' in startParamJson && typeof startParamJson.chat_id === 'number') {
        startParamChatId = startParamJson.chat_id
      }
      if ('balance_user_id' in startParamJson) {
        const balanceUserId = Number(startParamJson.balance_user_id)
        if (Number.isFinite(balanceUserId)) {
          startParamBalanceUserId = balanceUserId
        }
      }
      if (typeof startParamJson.balance_debt === 'object' && startParamJson.balance_debt !== null) {
        const balanceDebt = startParamJson.balance_debt as Record<string, unknown>
        const fromUserId = Number(balanceDebt.from_user_id)
        const toUserId = Number(balanceDebt.to_user_id)
        const currencyId = typeof balanceDebt.currency_id === 'string' ? balanceDebt.currency_id : undefined
        const amount = Number(balanceDebt.amount)

        if (Number.isFinite(fromUserId) && Number.isFinite(toUserId) && currencyId) {
          startParamBalanceDebt = {
            from_user_id: fromUserId,
            to_user_id: toUserId,
            currency_id: currencyId,
            ...(Number.isFinite(amount) ? { amount } : {}),
          }
        }
      }
      if ('pw_txid' in startParamJson && typeof startParamJson.pw_txid === 'string') {
        startParamPwTxId = startParamJson.pw_txid
      }
      if ('paywall_source' in startParamJson && typeof startParamJson.paywall_source === 'string') {
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

  const shouldHandleStartParamRoute = hasUnhandledStartParamRoute(startParam)
  const startParamRouteTxId = shouldHandleStartParamRoute && !isTransactionInnerPath
    ? startParamTxId
    : undefined
  const routeTxId = queryTxId || startParamRouteTxId
  const { data: transactionChatId } = useGetTransactionChatId(routeTxId)

  if (!startParamBalanceUserId && startParamBalanceDebt) {
    startParamBalanceUserId = startParamBalanceDebt.from_user_id
  }

  if (txId === undefined || (!!routeTxId && txId !== routeTxId)) {
    setTxId(routeTxId || 'demo-tx')
  }

  if (chatIdStart === undefined && startParamChatId) {
    setChatIdStart(startParamChatId)
  }

  if (
    chatIdStart === undefined &&
    startParamChatId === undefined &&
    routeTxId &&
    typeof transactionChatId?.chat_id === 'number'
  ) {
    setChatIdStart(transactionChatId.chat_id)
  }

  if (startBalanceUserId === undefined && startParamBalanceUserId) {
    setStartBalanceUserId(startParamBalanceUserId)
  }

  if (startBalanceDebt === undefined && startParamBalanceDebt) {
    setStartBalanceDebt(startParamBalanceDebt)
  }

  if (pwTxId === undefined && startParamPwTxId) {
    setPwTxId(startParamPwTxId)
  }

  if (paywallSource === undefined && startParamPaywallSource) {
    setPaywallSource(startParamPaywallSource)
  }

  if (routeTxId && flow !== 'transaction') {
    setFlow('transaction')
  }

  if ((routerLocation.pathname === '/' || routerLocation.pathname.includes('/summary')) && flow !== 'summary') {
    setFlow('summary')
  }

  useEffect(() => {
    if (
      routeTxId &&
      routeTxId !== 'demo-tx' &&
      routerLocation.pathname !== '/edit' &&
      !isTransactionInnerPath
    ) {
      if (shouldHandleStartParamRoute) {
        markStartParamRouteHandled(startParam)
      }
      navigate(getTransactionEditPath(routeTxId), { replace: true })
      return
    }

    if (routeTxId) {
      if (shouldHandleStartParamRoute) {
        markStartParamRouteHandled(startParam)
      }
      return
    }

    if (!shouldHandleStartParamRoute) {
      return
    }

    if (startParamPaywallSource) {
      markStartParamRouteHandled(startParam)
      if (routerLocation.pathname !== '/paywall') {
        navigate('/paywall', { replace: true })
      }
      return
    }

    if (startParamScreen === 'profile') {
      markStartParamRouteHandled(startParam)
      if (routerLocation.pathname !== '/profile') {
        navigate('/profile', { replace: true })
      }
      return
    }

    if (
      startParamScreen === 'slide_prepaywall' ||
      startParamScreen === 'onboarding'
    ) {
      markStartParamRouteHandled(startParam)
      if (routerLocation.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true })
      }
      return
    }

    if (startParamChatId || startParamScreen === 'chat') {
      markStartParamRouteHandled(startParam)
      if (
        routerLocation.pathname !== '/' &&
        routerLocation.pathname !== '/summary'
      ) {
        navigate('/', { replace: true })
      }
    }
  }, [isTransactionInnerPath, navigate, queryTxId, routeTxId, routerLocation.pathname, shouldHandleStartParamRoute, startParam, startParamChatId, startParamPaywallSource, startParamScreen])

  useEffect(() => {
    if (!hasUnhandledStartParamRoute(startParam) || !startParamBalanceUserId) {
      return
    }

    markStartParamRouteHandled(startParam)

    if (routerLocation.pathname !== '/chat-balance') {
      navigate('/chat-balance', { replace: true })
    }
  }, [navigate, routerLocation.pathname, startParam, startParamBalanceUserId])

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
  }, [transaction, users, isAuthorSharesInited, setIsAuthorSharesInited, getUserById, setTransaction, userId])

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
  }, [feedback, flow, isFlowFeedback, setIsFlowFeedback, transaction])


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
  }, [feedback, isOnboardingFeedback, postUserOnboarding, routerLocation.pathname, setIsOnboardingFeedback, startParamRef])
}
