import { useQuery } from '@tanstack/react-query'

import { useStore } from '../store'
import { TCurrency, TTransaction, TUser } from '../types'
import { mockTransaction, mockUsers } from './mock'

const apiUrl = import.meta.env.VITE_API_URL
const staleTime = 60 * 1000

export const useCurrenciesQuery = () => {
  return (
    useQuery<TCurrency[], Error>({
      queryKey: ['currencies'],
      queryFn: () =>
        fetch(`${apiUrl}/users`).then(
          (res) => res.json(),
        ),
      onSuccess: (data) => {
        console.log('success currencies data', data)
      },
      staleTime
    })
  )
}

export const useTxQuery = (txId: string | null) => {
  const { setTransaction } = useStore()
  return (
    useQuery<TTransaction, Error>({
      queryKey: ['tx', `tx-${txId}`],
      queryFn: txId
        ? () =>
          fetch(`${apiUrl}/users`).then(
            (res) => res.json(),
          )
        : () => mockTransaction,
      onSuccess: (data) => {
        console.log('success tx data', data)
        setTransaction(data)
      },
      staleTime
    })
  )
}

export const useUsersQuery = (chatId: null | string) => {
  const { setUsers } = useStore()
  return (
    useQuery<TUser[], Error>({
      queryKey: ['users', `chat-${chatId}`],
      queryFn: chatId
        ? () =>
          fetch(`${apiUrl}/users`).then(
            (res) => res.json(),
          )
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
  fetch(`${apiUrl}/posts/1`, {
    method: 'PATCH',
    body: JSON.stringify(tx),
    headers: {
      "Content-type": "application/json"
    },
  })
