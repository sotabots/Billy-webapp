import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useNewTx } from '../hooks'
import { useStore } from '../store'
import { TCurrency, TCategories, TTransaction, TNewTransaction, TUser, TChat, TSummary } from '../types'
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
          fetch(`${apiUrl}/chats/${chatId}/users`, {
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
          fetch(`${apiUrl}/chats/${chatId}/settings`, {
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
          fetch(`${apiUrl}/currencies/`, {
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
  const { setTransactions } = useStore()

  return (
    useQuery<TTransaction[], Error>({
      queryKey: ['transactions', `chat-${chatId}`],
      queryFn: chatId === 0
        ? () => mockTransactions
        : () =>
          fetch(`${apiUrl}/chats/${chatId}/transactions`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('useApi: set transactions', data)
        setTransactions(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}
