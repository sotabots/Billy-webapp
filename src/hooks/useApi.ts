import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useAuth, useNewTx, useChatId, useStore } from '../hooks'
import { TCurrency, TCategories, TTransaction, TNewTransaction, TUser, TChat, TSummary, TCurrencyId, TLanguageCode, TMode, TPlan, TProfile, TUserSettings, TPayoffMethods, TUserPayoffMethod, TUserId } from '../types'
import {
  mockTransaction,
  mockUsers,
  mockCurrencies,
  mockChat,
  mockSummary,
  mockTransactions,
  mockMyPayoffMethods,
  mockAllPayoffMethods
} from './useApiMock'

const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText}`);
  }
  return res.json()
}

export const useGetTx = () => {
  const { authString } = useAuth()
  const { apiUrl, transaction, setTransaction, txId } = useStore()
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
        return fetch(`${apiUrl}/transactions/${txId}`, {
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
      enabled: txId !== undefined && !!apiUrl,
    })
  )
}

export const useGetUsers = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockUsers
        : () =>
          fetch(`${apiUrl}/chat/users?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined && !!apiUrl,
      staleTime
    })
  )
}

export const useGetUser = () => {
  const { apiUrl } = useStore()
  const { authString, userId } = useAuth()
  const { chatId } = useChatId()

  const url = `${apiUrl}/users/details?${new URLSearchParams({
    ...(chatId ? { chat_id: String(chatId) } : {}),
  })}`

  return (
    useQuery<TUser, Error>({
      queryKey: ['user', `user-${userId}-${chatId}`],
      queryFn: () =>
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!userId && !!apiUrl,
      staleTime
    })
  )
}

export const useGetChat = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TChat, Error>({
      queryKey: ['chat', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockChat
        : () =>
          fetch(`${apiUrl}/chat/settings?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined && !!apiUrl,
      staleTime
    })
  )
}

export const useGetCurrencies = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockCurrencies
        : () =>
          fetch(`${apiUrl}/currencies/?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined && !!apiUrl,
      staleTime
    })
  )
}

export const usePutTransaction = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { txId } = useStore()
  const url = txId?.includes('demo')
    ? 'https://jsonplaceholder.typicode.com/posts/1'
    : `${apiUrl}/transactions/${txId}`

  return (tx: TTransaction) =>
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(tx),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostTransaction = () => { // +settleup
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/transactions/`

  return (newTx: TNewTransaction) =>
    fetch(url, {
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
  const { summaryCurrencyId, apiUrl } = useStore()
  const { chatId } = useChatId()

  const url = `${apiUrl}/summary?${new URLSearchParams({
    ...(chatId ? { chat_id: String(chatId) } : {}),
    ...(summaryCurrencyId ? { target_currency_id: String(summaryCurrencyId) } : {}),
  })}`

  return (
    useQuery<TSummary, Error>({
      queryKey: ['summary', `summary-${chatId}-${summaryCurrencyId}`],
      queryFn: chatId >= -1 // no demo summary, no pm summary
        ? () => mockSummary
        : () =>
          fetch(url , {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined && !!apiUrl,
      staleTime
    })
  )
}

export const useGetCategories = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()

  return (
    useQuery<TCategories, Error>({
      queryKey: ['categories'],
      queryFn: () =>
        fetch(`${apiUrl}/general/categories`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      staleTime,
      enabled: !!apiUrl,
    })
  )
}

export const useGetTransactions = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<TTransaction[], Error>({
      queryKey: ['transactions', `chat-${chatId}`],
      queryFn: chatId === 0 // disable transactions request for tx-flow (startParamTxId)
        ? () => mockTransactions
        : () =>
          fetch(`${apiUrl}/chat/transactions?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId !== undefined && !!apiUrl,
      staleTime
    })
  )
}

export const usePostChatMode = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/mode?chat_id=${chatId}`

  return (mode: TMode) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ mode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCurrency = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/currency?chat_id=${chatId}`

  return (currencyId: TCurrencyId) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ currency_id: currencyId }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatLanguage = () => { // todo: remove
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/language?chat_id=${chatId}`

  return (languageCode: TLanguageCode) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ language_code: languageCode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostUserLanguage = () => {
  const { apiUrl } = useStore()
  const { authString, userId } = useAuth()
  const url = userId
    ? `${apiUrl}/users/language`
    : 'https://jsonplaceholder.typicode.com/posts'

  return (languageCode: TLanguageCode) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({ language_code: languageCode }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatSilent = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/silent?chat_id=${chatId}`

  return (isSilentMode: boolean) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        silent_mode: isSilentMode,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatMonthlyLimit = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/monthly_limit?chat_id=${chatId}`

  return (monthlyLimit: number) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        monthly_limit: monthlyLimit,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCashback = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/cashback?chat_id=${chatId}`

  return (cashback: number) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        cashback: cashback,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostChatActiveUsers = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/active_users?chat_id=${chatId}`

  return (activeUsers: TUserId[]) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(activeUsers),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetSummarySheetRebuild = () => {
  const { apiUrl } = useStore()
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/summary/gsheet?chat_id=${chatId}`

  return () =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const usePostUserOnboarding = () => {
  const { apiUrl } = useStore()
  const [initDataUnsafe] = useInitData()
  const { authString, userId } = useAuth()
  const url = userId
    ? `${apiUrl}/users/start_onboarding`
    : 'https://jsonplaceholder.typicode.com/posts'

  return ({ ref }: {
    ref?: number
  }) =>
    fetch(url, {
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
  const { apiUrl, pwTxId } = useStore()

  return ({ amount, productKey }: TPlan) => {
    const url = `${apiUrl}/payments/`
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        amount: String(amount),
        product_key: productKey,
        pw_txid: pwTxId,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
  }
}

export const useGetVoiceLimit = () => {
  const { apiUrl } = useStore()
  const { authString, isAuth } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<number, Error>({
      queryKey: ['voice_limit', `voice_limit-${chatId}`],
      queryFn: chatId === 0
        ? () => -1
        : () =>
          fetch(`${apiUrl}/chat/voice_limit?chat_id=${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: (chatId === 0 || (!!chatId && isAuth)) && !!apiUrl,
    })
  )
}

export const useGetProfile = () => {
  const { apiUrl } = useStore()
  const { authString, userId } = useAuth()
  return (
    useQuery<TProfile, Error>({
      queryKey: [`profile-${userId}`],
      queryFn: () =>
        fetch(`${apiUrl}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!userId && !!apiUrl,
    })
  )
}

export const useGetUserSettings = () => {
  const { apiUrl } = useStore()
  const { authString, userId } = useAuth()
  return (
    useQuery<TUserSettings, Error>({
      queryKey: [`userSettings-${userId}`],
      queryFn: () =>
        fetch(`${apiUrl}/users/settings`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!userId && !!apiUrl,
    })
  )
}

export const usePostUserSettings = () => {
  const { apiUrl } = useStore()
  const { authString, isAuth } = useAuth()

  const url = !isAuth
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/users/settings`

  return (userSettings: TUserSettings) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...userSettings,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}

export const useGetAllPayoffMethods = () => {
  const { apiUrl } = useStore()
  // const { authString, userId } = useAuth()
  return (
    useQuery<TPayoffMethods, Error>({
      queryKey: [`allPayoffMethods-${/*userId*/''}`],
      queryFn: Math.random() > 0 // todo: remove
        ? () => mockAllPayoffMethods
        : () => fetch(`${apiUrl}/users/settings`, { // todo: change
          method: 'GET',
          /* headers: {
            'Authorization': authString,
          } */
        }).then(handleJsonResponse),
      // enabled: !!userId && !!apiUrl,
      enabled: !!apiUrl,
    })
  )
}

export const useGetMyPayoffMethods = () => {
  const { apiUrl } = useStore()
  const { authString, userId } = useAuth()
  return (
    useQuery<TUserPayoffMethod[], Error>({
      queryKey: [`userPayoffMethods-${userId}`],
      queryFn: Math.random() > 0 // todo: remove
        ? () => mockMyPayoffMethods
        : () => fetch(`${apiUrl}/users/payoff_methods`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: (true || !!userId) && !!apiUrl, // todo: remove true
    })
  )
}

export const usePostMyPayoffMethods = () => {
  const { apiUrl } = useStore()
  const { authString, isAuth } = useAuth()

  const url = (Math.random() > 0 || !isAuth) // todo: disable
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/users/settings` // todo: change

  return (payoffMethods: TPayoffMethods) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        ...payoffMethods,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': authString,
      },
    }).then(handleJsonResponse)
}
