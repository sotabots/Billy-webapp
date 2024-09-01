import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useUsers } from '../hooks'
import type { TUser } from '../types'

export const usePro = () => {
  const [initDataUnsafe] = useInitData()
  const { getUserById } = useUsers()

  const userId = initDataUnsafe.user?.id
  const user: TUser | undefined  = userId && getUserById(userId) || undefined

  const isPro = !!user?.has_active_subscription

  return { isPro }
}
