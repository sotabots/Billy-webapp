import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TCurrency, TTransaction, TUser, TChat } from '../types'
import { mockTransaction, mockUsers, mockCurrencies, mockChat } from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 5 * 60 * 1000

const handleJsonResponse = (res: any) => {
  if (!res.ok) {
    throw new Error(`Backend ${res.status}`);
  }
  return res.json()
}

export const useTxQuery = () => {
  const { setTransaction, txId } = useStore()
  console.log('useTxQuery txId', txId)
  return (
    useQuery<TTransaction, Error>({
      queryKey: ['tx', `tx-${txId}`],
      queryFn: txId
        ? () =>
          fetch(`${apiUrl}/transactions/${txId}`)
            .then(handleJsonResponse)
        : () => mockTransaction,
      onSuccess: (data) => {
        console.log('useApi: set tx', data)
        setTransaction(data)
      },
      staleTime
    })
  )
}

export const useUsersQuery = (chatId: undefined | string | null) => {
  const { setUsers } = useStore()
  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId
        ? () =>
          fetch(`${apiUrl}/chats/${chatId}/users`)
            .then(handleJsonResponse)
            // .then(json => json.users)
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

export const useChatQuery = (chatId: undefined | string | null) => {
  const { setChat } = useStore()
  return (
    useQuery<TChat, Error>({
      queryKey: ['chat', `chat-${chatId}`],
      queryFn: (chatId /* || !'DISABLE_MOCK_CHAT'*/)
        ? () =>
          fetch(`${apiUrl}/chats/${chatId}`)
            .then(handleJsonResponse)
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

export const useCurrenciesQuery = (chatId: undefined | string | null) => {
  const { setCurrencies } = useStore()
  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies'],
      queryFn: (chatId || !!'DISABLE_MOCK_CURRENCIES')
        ? () =>
          fetch(`${apiUrl}/currencies/`)
            .then(handleJsonResponse)
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

export const usePatchTransaction = () => {
  const { txId } = useStore()
  const url = txId ? `${apiUrl}/transactions/${txId}` : 'https://jsonplaceholder.typicode.com/posts/1'
  return (tx: TTransaction) =>
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(tx),
      headers: {
        "Content-type": "application/json"
      },
    }).then(handleJsonResponse)
}