import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useNewTx, useChatId, useStore } from '../hooks'
import { TCurrency, TCategories, TTransaction, TNewTransaction, TUser, TChat, TSummary, TCurrencyId, TLanguageCode, TMode, TPlan } from '../types'
import {
  mockTransaction,
  mockUsers,
  mockCurrencies,
  mockChat,
  mockSummary,
  mockTransactions
} from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: Response) => {
  if (!res.ok) {
    throw new Error(`[${res.status}] ${res.statusText}`);
  }
  return res.json()
}

export const useGetTx = () => {
  const [, initData] = useInitData()
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
            'Authorization': initData,
          }
        }).then(handleJsonResponse)
      },
      onSuccess: (data) => {
        console.log('useApi: set tx', data)
        setTransaction(data)
      },
      enabled: txId !== undefined,
      staleTime
    })
  )
}

export const useGetUsers = (chatId: undefined | number) => {
  const [, initData] = useInitData()
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
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set users', data)
        setUsers(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetChat = (chatId: undefined | number) => {
  const [, initData] = useInitData()
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
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set chat', data)
        setChat(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetCurrencies = (chatId: undefined | number) => {
  const [, initData] = useInitData()
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
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set currencies', data)
        setCurrencies(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const usePutTransaction = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostTransaction = () => { // summary settleup
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const useGetSummary = () => {
  const [, initData] = useInitData()
  const { setSummary, summaryId, summaryCurrencyId } = useStore()
  console.log('useGetSummary summaryId', summaryId, summaryCurrencyId)

  const url = `${apiUrl}/summary/${summaryId}` +
    (summaryCurrencyId
      ? `?${new URLSearchParams({
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
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useGetSummary: setSummary', data)
        setSummary(data)
      },
      enabled: summaryId !== undefined,
      staleTime
    })
  )
}

export const useGetCategories = () => {
  const [, initData] = useInitData()
  const { setCategories } = useStore()

  return (
    useQuery<TCategories, Error>({
      queryKey: ['categories'],
      queryFn: () =>
        fetch(`${apiUrl}/general/categories`, {
          method: 'GET',
          headers: {
            'Authorization': initData,
          }
        }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set categories', data)
        setCategories(data)
      },
      staleTime
    })
  )
}

export const useGetTransactions = (chatId: undefined | number) => {
  const [, initData] = useInitData()
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
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set transactions', data)
        setTransactions(data)
      },
      enabled: chatId !== undefined && summaryId !== undefined, // todo: remove summary later?
      staleTime
    })
  )
}

export const usePostChatMode = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCurrency = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostChatLanguage = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostChatSilent = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostChatMonthlyLimit = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostChatCashback = () => {
  const [, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const useGetSummarySheetRebuild = () => {
  const [, initData] = useInitData()
  const { summaryId } = useStore()
  const url = (!summaryId || summaryId?.includes('demo'))
    ? 'https://jsonplaceholder.typicode.com/posts'
    : `${apiUrl}/summary/${summaryId}/gsheet`

  return () =>
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostUserOnboarding = () => {
  const [initDataUnsafe, initData] = useInitData()
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
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const usePostPayment = () => {
  const [, initData] = useInitData()

  return ({ amount, productKey }: TPlan) => {
    const url = `${apiUrl}/payments/`
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        amount: String(amount),
        product_key: productKey,
      }),
      headers: {
        'Content-type': 'application/json',
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
  }
}
