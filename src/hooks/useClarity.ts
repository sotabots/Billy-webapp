import { clarity } from 'react-microsoft-clarity'

import { useAuth /*, useChatId */ } from '../hooks'

const isDev = import.meta.env.MODE === 'development'

const CLARITY_ID: undefined | string = isDev ? undefined : import.meta.env.VITE_CLARITY_ID

export const useClarity = () => {
  // const { chatId } = useChatId()
  const { userId } = useAuth()

  if (CLARITY_ID) {
    clarity.init(CLARITY_ID)
    if (userId) {
      clarity.identify(String(userId), {
        // chatId
      })
    }
  }
}
