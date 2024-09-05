import { useInitData } from '@vkruglikov/react-telegram-web-app'

const isDev = import.meta.env.MODE === 'development'

const AUTH: undefined | string = isDev ? import.meta.env.VITE_AUTH : undefined
const USER_ID: undefined | string = isDev ? import.meta.env.VITE_USER_ID : undefined

if (isDev) {
  console.log('[dev] AUTH', AUTH)
  console.log('[dev] USER_ID', USER_ID)
}

export const useAuth = () => {
  const [initDataUnsafe, initData] = useInitData()

  const authString: string =
    initData ||
    AUTH ||
    ''

  const isAuth = !!authString

  const userId: number | undefined =
    initDataUnsafe?.user?.id ||
    (USER_ID ? parseInt(USER_ID) : undefined) ||
    undefined

  const username: string | undefined =
    initDataUnsafe?.user?.username

  return { isAuth, authString, userId, username }
}
