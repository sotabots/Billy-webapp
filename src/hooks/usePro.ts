import { useGetUser } from '../api'

export const usePro = () => {
  const { data, refetch: refetchPro } = useGetUser()

  const isPro = !!data?.has_active_subscription

  return { isPro, refetchPro }
}
