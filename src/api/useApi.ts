import { useQuery } from '@tanstack/react-query'
import { TCurrency } from '../types'

const apiUrl = import.meta.env.VITE_API_URL

export const useCurrenciesQuery = () => useQuery<TCurrency[], Error>({
  queryKey: ['currencies'],
  queryFn: () =>
    fetch(`${apiUrl}/users`).then(
      (res) => res.json(),
    ),
  onSuccess: (data) => {
    console.log('data', data)
  },
  staleTime: 60 * 1000
})
