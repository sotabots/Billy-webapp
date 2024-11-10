import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useAuth, useNewTx, useChatId, useStore } from '../hooks'
import { TCurrency, TCategories, TTransaction, TNewTransaction, TUser, TChat, TSummary, TCurrencyId, TLanguageCode, TMode, TPlan, TProfile } from '../types'
import {
  mockTransaction,
  mockUsers,
  mockCurrencies,
  mockChat,
  mockSummary,
  mockTransactions
} from './useApiMock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText}`);
  }
  return res.json()
}

export const useGetTx = () => {
  const { authString } = useAuth()
  const { setTransaction, txId } = useStore()
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
        console.log('useApi onSuccess useGetTx', data)
        setTransaction(data)
      },
      enabled: txId !== undefined,
      staleTime
    })
  )
}

export const useGetUsers = (chatId: undefined | number) => {
  const { authString } = useAuth()
  const { setUsers } = useStore()

  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockUsers
        : () =>
          fetch(`${apiUrl}/chat/${chatId}/users`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi onSuccess useGetUsers', data)
        setUsers(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetUser = (_userId?: number) => {
  const { authString, userId } = useAuth()
  const id = _userId || userId

  return (
    useQuery<TUser, Error>({
      queryKey: ['user', `user-${id}`],
      queryFn: () =>
        fetch(`${apiUrl}/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!id,
      staleTime
    })
  )
}

export const useGetChat = (chatId: undefined | number) => {
  const { authString } = useAuth()
  const { setChat } = useStore()

  return (
    useQuery<TChat, Error>({
      queryKey: ['chat', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockChat
        : () =>
          fetch(`${apiUrl}/chat/${chatId}/settings`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useGetChat onSuccess useGetChat', data)
        setChat(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetCurrencies = (chatId: undefined | number) => {
  const { authString } = useAuth()
  const { setCurrencies } = useStore()

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
      onSuccess: (data) => {
        console.log('useApi onSuccess useGetCurrencies', data)
        setCurrencies(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const usePutTransaction = () => {
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

export const usePostTransaction = () => { // summary settleup
  const { authString } = useAuth()
  const { summaryId } = useStore()
  const url = summaryId?.includes('demo')
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
  const { summaryId, summaryCurrencyId } = useStore()
  console.log('useGetSummary summaryId', summaryId, summaryCurrencyId)

  const url = `${apiUrl}/summary` +
    (summaryCurrencyId
      ? `?${new URLSearchParams({
          ...(summaryId ? { summary_id: summaryId, } : {}),
          target_currency_id: String(summaryCurrencyId),
        })}`
      : ''
    )

  return (
    useQuery<TSummary, Error>({
      queryKey: ['summary', `summary-${summaryId}-${summaryCurrencyId}`],
      queryFn: summaryId?.includes('demo')
        ? () => mockSummary
        : () =>
          fetch(url , {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: summaryId !== undefined,
      staleTime
    })
  )
}

export const useGetCategories = () => {
  const { authString } = useAuth()
  const { setCategories } = useStore()

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
      onSuccess: (data) => {
        console.log('useApi onSuccess useGetCategories', data)
        setCategories(data)
      },
      staleTime
    })
  )
}

export const useGetTransactions = (chatId: undefined | number) => {
  const { authString } = useAuth()
  const { setTransactions, summaryId } = useStore()

  return (
    useQuery<TTransaction[], Error>({
      queryKey: ['transactions', `chat-${chatId}`],
      queryFn: chatId === 0 || summaryId?.includes('demo') // disable transactions request for tx-flow (startParamTxId)
        ? () => mockTransactions
        : () =>
          fetch(`${apiUrl}/chat/${chatId}/transactions`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi onSuccess useGetTransactions', data)
        setTransactions(data)
      },
      enabled: chatId !== undefined && summaryId !== undefined, // todo: remove summary later?
      staleTime
    })
  )
}

export const usePostChatMode = () => {
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/mode`

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
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/currency`

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
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/language`

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
  const { authString, userId } = useAuth()
  const url = userId
    ? `${apiUrl}/users/${userId}/language`
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
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/silent`

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
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/monthly_limit`

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
  const { authString } = useAuth()
  const { chatId } = useChatId()
  const url = chatId === 0
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/chat/${chatId}/cashback`

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

export const useGetSummarySheetRebuild = () => {
  const { authString } = useAuth()
  const { summaryId } = useStore()
  const url = (!summaryId || summaryId?.includes('demo'))
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/summary/gsheet?summary_id=${summaryId}`

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
  const [initDataUnsafe] = useInitData()
  // todo: better initData+useAuth
  const { authString } = useAuth()
  const url = initDataUnsafe.user
    ? `${apiUrl}/users/${initDataUnsafe.user.id}/start_onb`
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
  const { pwTxId } = useStore()

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
  const { authString, isAuth } = useAuth()
  const { chatId } = useChatId()

  return (
    useQuery<number, Error>({
      queryKey: ['voice_limit', `voice_limit-${chatId}`],
      queryFn: chatId === 0
        ? () => -1
        : () =>
          fetch(`${apiUrl}/chat/${chatId}/voice_limit`, {
            method: 'GET',
            headers: {
              'Authorization': authString,
            }
          }).then(handleJsonResponse),
      enabled: chatId === 0 || (!!chatId && isAuth),
      // staleTime: 25 * 1000,
      // refetchInterval: 30 * 1000,
    })
  )
}

export const useGetProfile = () => {
  const { authString, userId } = useAuth()
  return (
    useQuery<TProfile, Error>({
      queryKey: [`profile-${userId}`],
      queryFn: () =>
        fetch(`${apiUrl}/users/profile?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': authString,
          }
        }).then(handleJsonResponse),
      enabled: !!userId,
    })
  )
}
