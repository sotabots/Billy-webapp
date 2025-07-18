import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useAuth, useNewTx, useChatId, useStore } from '../hooks'
import { TCurrency, TCategories, TTransaction, TNewTransaction, TUser, TChat, TSummary, TCurrencyId, TLanguageCode, TMode, TPlan, TProfile, TUserSettings, TPayoffMethods, TUserPayoffMethod } from '../types'
import {
  mockTransaction,
  mockUsers,
  mockCurrencies,
  mockChat,
  mockSummary,
  mockTransactions,
} from './useApiMock'

const apiUrl = import.meta.env.VITE_API_URL
const fallbackApiUrl = import.meta.env.VITE_FALLBACK_API_URL
const staleTime = 5 * 60 * 1000

const fetchWithFallback = async (path: string, options: RequestInit) => {
  const primaryUrl = `${apiUrl}${path}`
  const fallbackUrl = fallbackApiUrl ? `${fallbackApiUrl}${path}` : undefined

  const timeout = 15000 // 15 seconds

  const fetchWithTimeout = (url: string) => {
    return new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'))
      }, timeout)

      fetch(url, options)
        .then(response => {
          clearTimeout(timer)
          resolve(response)
        })
        .catch(err => {
          clearTimeout(timer)
          reject(err)
        })
    })
  }

  try {
    const response = await fetchWithTimeout(primaryUrl)
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      return response
    }
    // For 5xx errors, we will try the fallback.
    if (!fallbackUrl) {
      return response // No fallback, return the original response
    }
  } catch (error) {
    console.warn('Primary API request failed, trying fallback. Error:', error)
    if (!fallbackUrl) {
      throw error // No fallback, re-throw the error
    }
  }

  if (fallbackUrl) {
    try {
      const fallbackResponse = await fetchWithTimeout(fallbackUrl)
      return fallbackResponse
    } catch (fallbackError) {
      console.error('Fallback API request also failed. Error:', fallbackError)
      throw fallbackError // Both failed, throw the fallback error
    }
  }

  throw new Error('Both primary and fallback API requests failed.')
}

const handleJsonResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText}`);
  }
  return res.json()
}

export const useGetTx = () => {
  const { authString } = useAuth()
  const { transaction, setTransaction, txId } = useStore()
  const { newTx } = useNewTx()
  console.log('useGetTx txId', txId)

  return (
    useQuery<TTransaction | TNewTransaction, Error>({
      queryKey: ['tx', `tx-${txId}`],
      queryFn: () => {
        if (txId?.includes('demo')) {
          return mockTransactions.find(tx => tx._id === txId) || mockTransaction
        }
        if (txId === 'NEW') {
          return newTx
        }
        return fetchWithFallback(`/transactions/${txId}`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse)
      },
      onSuccess: (data) => {
        if (data?._id && data._id !== transaction?._id) {
          setTransaction(data)
        }
      },
      enabled: txId !== undefined,
    })
  )
}

export const useGetUsers = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockUsers
        : () =>
          fetchWithFallback(`/chat/users?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetUser = () => {
  const { authString, userId } = useAuth()
  const { chatId } = useChatId()

  const path = `/users/details?${new URLSearchParams({
    ...(chatId ? { chat_id: String(chatId) } : {}),
  })}`

  return (
    useQuery<TUser, Error>({
      queryKey: ['user', `user-${userId}-${chatId}`],
      queryFn: () =>
        fetchWithFallback(path, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!userId,
      staleTime
    })
  )
}

export const useGetChat = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TChat, Error>({
      queryKey: ['chat', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockChat
        : () =>
          fetchWithFallback(`/chat/settings?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetCurrencies = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockCurrencies
        : () =>
          fetchWithFallback(`/currencies/?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const usePutTransaction = () => {
  const { authString } = useAuth()
  const { txId } = useStore()
  const path = txId?.includes('demo')
    ? 'https://jsonplaceholder.typicode.com/posts/1'
    : `/transactions/${txId}`

  return (tx: TTransaction) =>
    fetchWithFallback(path, {
      method: 'PUT',
      body: JSON.stringify(tx),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostTransaction = () => { // +settleup
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const path = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `/transactions/`

  return (newTx: TNewTransaction) =>
    fetchWithFallback(path, {
      method: 'POST',
      body: JSON.stringify({...newTx, _id: undefined}), // clear _id: 'NEW'
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetSummary = () => {
  const { authString } = useAuth()
  const { summaryCurrencyId } = useStore()
  const { chatId } = useChatId()

  const path = `/summary?${new URLSearchParams({
    ...(chatId ? { chat_id: String(chatId) } : {}),
    ...(summaryCurrencyId ? { target_currency_id: String(summaryCurrencyId) } : {}),
  })}`

  return (
    useQuery<TSummary, Error>({
      queryKey: ['summary', `summary-${chatId}-${summaryCurrencyId}`],
      queryFn: chatId >= -1 // no demo summary, no pm summary
        ? () => mockSummary
        : () =>
          fetchWithFallback(path , {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetCategories = () => {
  const { authString } = useAuth()

  return (
    useQuery<TCategories, Error>({
      queryKey: ['categories'],
      queryFn: () =>
        fetchWithFallback(`/general/categories`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      staleTime
    })
  )
}

export const useGetTransactions = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TTransaction[], Error>({
      queryKey: ['transactions', `chat-${chatId}`],
      queryFn: chatId === 0 // disable transactions request for tx-flow (startParamTxId)
        ? () => mockTransactions
        : () =>
          fetchWithFallback(`/chat/transactions?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const usePostChatMode = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (mode: TMode) =>
    fetchWithFallback(`/chat/mode?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ mode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCurrency = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (currencyId: TCurrencyId) =>
    fetchWithFallback(`/chat/default_currency?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ currency_id: currencyId }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatLanguage = () => { // todo: remove
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (languageCode: TLanguageCode) =>
    fetchWithFallback(`/chat/language?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ language_code: languageCode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostUserLanguage = () => {
  const { authString, userId } = useAuth()

  return (languageCode: TLanguageCode) =>
    fetchWithFallback(`/users/language?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ language_code: languageCode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatSilent = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (isSilent: boolean) =>
    fetchWithFallback(`/chat/silent_mode?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ is_silent: isSilent }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatMonthlyLimit = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (limit: number) =>
    fetchWithFallback(`/chat/monthly_limit?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ limit }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCashback = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (cashback: number) =>
    fetchWithFallback(`/chat/cashback?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ cashback }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatActiveUsers = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (userIds: number[]) =>
    fetchWithFallback(`/chat/users?chat_id=${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ users: userIds }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetSummarySheetRebuild = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return () =>
    fetchWithFallback(`/summary/rebuild?chat_id=${chatId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostUserOnboarding = () => {
  const [initDataUnsafe] = useInitData()
  const { authString } = useAuth()

  return ({ ref }: {
    ref?: number
  }) =>
    fetchWithFallback('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify({
        user: initDataUnsafe.user,
        ref,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostPayment = () => {
  const { authString } = useAuth()
  const { pwTxId } = useStore()

  return (plan: TPlan) =>
    fetchWithFallback(`/payments/`, {
      method: 'POST',
      body: JSON.stringify({
        amount: String(plan.amount),
        product_key: plan.productKey,
        pw_txid: pwTxId,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetVoiceLimit = () => {
  const { authString, userId } = useAuth()

  return useQuery<number, Error>({
    queryKey: ['voice-limit', `user-${userId}`],
    queryFn: () =>
      fetchWithFallback(`/users/voice-limit`, {
        method: 'GET',
        headers: {
          'Authorization': authString,
        }
      }).then(handleJsonResponse),
    enabled: !!userId,
  })
}

export const useGetProfile = () => {
  const { authString } = useAuth()

  return useQuery<TProfile, Error>({
    queryKey: ['profile'],
    queryFn: () =>
      fetchWithFallback(`/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': authString,
        }
      }).then(handleJsonResponse),
    enabled: true,
  })
}

export const useGetUserSettings = () => {
  const { authString } = useAuth()

  return useQuery<TUserSettings, Error>({
    queryKey: ['user-settings'],
    queryFn: () =>
      fetchWithFallback(`/users/settings`, {
        method: 'GET',
        headers: {
          'Authorization': authString,
        }
      }).then(handleJsonResponse),
    enabled: true,
  })
}

export const usePostUserSettings = () => {
  const { authString } = useAuth()

  return (settings: TUserSettings) =>
    fetchWithFallback(`/users/settings`, {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetAllPayoffMethods = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return useQuery<TPayoffMethods, Error>({
    queryKey: ['all-payoff-methods', `chat-${chatId}`],
    queryFn: () =>
      fetchWithFallback(`/payoff-methods/list?chat_id=${chatId}`, {
        method: 'GET',
        headers: {
          'Authorization': authString,
        }
      }).then(handleJsonResponse),
    enabled: chatId !== undefined,
  })
}

export const useGetMyPayoffMethods = () => {
  const { authString, userId } = useAuth()

  return useQuery<TUserPayoffMethod[], Error>({
    queryKey: ['my-payoff-methods', `user-${userId}`],
    queryFn: () =>
      fetchWithFallback(`/payoff-methods/my`, {
        method: 'GET',
        headers: {
          'Authorization': authString,
        }
      }).then(handleJsonResponse),
    enabled: userId !== undefined,
  })
}

export const usePostMyPayoffMethods = () => {
  const { authString, userId } = useAuth()

  return (methods: TUserPayoffMethod[]) =>
    fetchWithFallback(`/payoff-methods/my`, {
      method: 'POST',
      body: JSON.stringify({ methods, user_id: userId }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

/*
export const useSettleUp = () => {
  const { authString } = useAuth()
  const { userId, toUserId } = useStore()
  const { chatId } = useChatId()

  const url = `/users/settle?${new URLSearchParams({
    user_id: String(userId),
    to_user_id: String(toUserId),
    ...(chatId ? { chat_id: String(chatId) } : {}),
  })}`

  return () =>
    fetchWithFallback(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}
*/

export const useDeleteTransaction = () => {
  const { authString } = useAuth()
  const { txId } = useStore()

  return () => {
    if (!txId) return Promise.reject(new Error('txId is undefined'));
    return fetchWithFallback(`/transactions/${txId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
  }
}
