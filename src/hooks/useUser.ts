import { useGetUser, useAuth } from '../hooks'
import { TLanguageCode, TUser } from '../types'

export const useUser = () => {
  const { data, refetch } = useGetUser()
  const { userId } = useAuth()

  const isPro: boolean | undefined = data?.has_active_subscription

  const tgLangRaw: string | undefined = window.Telegram?.WebApp.initDataUnsafe.user?.language_code
  const tgLang: TLanguageCode =
    tgLangRaw === 'ru' ? 'ru' :
    'en'

  const userLang: TLanguageCode = data?.language_code || tgLang

  const refetchUser = () => {
    if (userId) {
      refetch()
    }
  }

  const me: TUser | undefined = data

  return { me, isPro, userLang, refetchUser }
}
