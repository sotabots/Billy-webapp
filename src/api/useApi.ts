import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TCurrency, TTransaction, TUser } from '../types'
import { mockTransaction, mockUsers } from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 60 * 1000

const handleJsonResponse = (res: any) => {
  if (!res.ok) {
    throw new Error(`Backend ${res.status}`);
  }
  return res.json()
}

export const useCurrenciesQuery = () => {
  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies'],
      queryFn: () =>
        fetch(`${apiUrl}/currencies`)
          .then(handleJsonResponse),
      onSuccess: (data) => {
        console.log('success currencies data', data)
      },
      staleTime
    })
  )
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
        console.log('success tx data', data)
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
            .then(json => json.users)
        : () => mockUsers,
      onSuccess: (data) => {
        console.log('success users data', data)
        setUsers(data)
      },
      enabled: chatId !== undefined,
      staleTime
    })
  )
}

export const patchTransaction = (tx: TTransaction) =>
  fetch(`${apiUrl}/transactions/${tx._id}`, {
    method: 'PUT',
    body: JSON.stringify(tx),
    headers: {
      "Content-type": "application/json"
    },
  })
