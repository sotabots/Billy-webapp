import { useGetUser } from '../api'
import { TLanguageCode } from '../types'

export const useUser = () => {
  const { data, refetch: refetchUser } = useGetUser()

  const isPro = !!data?.has_active_subscription

  const tgLangRaw: string | undefined = window.Telegram?.WebApp.initDataUnsafe.user?.language_code
  const tgLang: TLanguageCode =
    tgLangRaw === 'ru' ? 'ru' :
    tgLangRaw === 'uk' ? 'uk' :
    'en'

  const userLang: undefined | TLanguageCode = data?.language_code || tgLang

  return { isPro, userLang, refetchUser }
}
