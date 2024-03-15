import { useInitData } from '@vkruglikov/react-telegram-web-app'
import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TCurrency, TTransaction, TNewTransaction, TUser, TChat, TSummary } from '../types'
import {
  mockTransaction,
  mockUsers,
  mockCurrencies,
  mockChat,
  mockSummary
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
  console.log('useGetTx txId', txId)

  return (
    useQuery<TTransaction, Error>({
      queryKey: ['tx', `tx-${txId}`],
      queryFn: txId
        ? () =>
          fetch(`${apiUrl}/transactions/${txId}`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse)
        : () => mockTransaction,
      onSuccess: (data) => {
        console.log('useApi: set tx', data)
        setTransaction(data)
      },
      staleTime
    })
  )
}

export const useGetUsers = (chatId: undefined | number | null) => {
  const [, initData] = useInitData()
  const { setUsers } = useStore()

  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId
        ? () =>
          fetch(`${apiUrl}/chats/${chatId}/users`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse)
        : () => mockUsers,
      onSuccess: (data) => {
        console.log('useApi: set users', data)
        setUsers(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetChat = (chatId: undefined | number | null) => {
  const [, initData] = useInitData()
  const { setChat } = useStore()

  return (
    useQuery<TChat, Error>({
      queryKey: ['chat', `chat-${chatId}`],
      queryFn: (chatId /* || !'DISABLE_MOCK_CHAT'*/)
        ? () =>
          fetch(`${apiUrl}/chat_settings/${chatId}`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse)
        : () => mockChat,
      onSuccess: (data) => {
        console.log('useApi: set chat', data)
        setChat(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const useGetCurrencies = (chatId: undefined | number | null) => {
  const [, initData] = useInitData()
  const { setCurrencies } = useStore()

  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies'],
      queryFn: (chatId || !!'DISABLE_MOCK_CURRENCIES')
        ? () =>
          fetch(`${apiUrl}/currencies/`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse)
          // .then(json => json.currencies)
        : () => mockCurrencies,
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
  const url = txId ? `${apiUrl}/transactions/${txId}` : 'https://jsonplaceholder.typicode.com/posts/1'

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
  const url = summaryId ? `${apiUrl}/transactions/` : 'https://jsonplaceholder.typicode.com/posts'

  return (newTx: TNewTransaction) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(newTx),
      headers: {
        'Content-type': 'application/json',
        'Authorization': initData,
      },
    }).then(handleJsonResponse)
}

export const useGetSummary = () => {
  const [, initData] = useInitData()
  const { setSummary, summaryId } = useStore()
  console.log('useGetSummary summaryId', summaryId)

  return (
    useQuery<TSummary, Error>({
      queryKey: ['summary', `summary-${summaryId}`],
      queryFn: summaryId
        ? () =>
          fetch(`${apiUrl}/summary/${summaryId}`, {
            method: 'GET',
            headers: {
              'Authorization': initData,
            }
          }).then(handleJsonResponse)
        : () => mockSummary,
      onSuccess: (data) => {
        console.log('useGetSummary: setSummary', data)
        setSummary(data)
      },
      staleTime
    })
  )
}