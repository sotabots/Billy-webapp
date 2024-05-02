import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { /*useChatId,*/ useUsers } from '../hooks'
import { useStore } from '../store'
import type { TNewTransaction } from '../types'

export const useNewTx = () => {
  const [initDataUnsafe] = useInitData()
  const { chat, summary } = useStore()
  // const { chatId } = useChatId() // recursion
  const { getUserById } = useUsers()

  const userId = initDataUnsafe.user?.id
  const user = userId ? getUserById(userId) : null // is user in chat?

  const newTx: TNewTransaction = {
    _id: 'NEW',
    chat_id: summary?.chat_id || null, // todo: improve
    creator_user_id: initDataUnsafe.user?.id || null,
    editor_user_id: null,
    is_voice: false,
    raw_text: '',
    currency_id: chat?.default_currency || null,
    is_confirmed: true,
    is_canceled: false,
    shares: !user ? [] : [true, false].map(isPayer => (
      {
        person_id: 'MESSAGE_AUTHOR',
        raw_name: null,
        normalized_name: 'MESSAGE_AUTHOR',
        is_payer: isPayer,
        amount: 0,
        user_candidates: null,
        related_user_id: user._id
      }
    )),
    nutshell: null,
    category: null,
    is_settleup: false,
    cashback: null,
  }

  return { newTx }
}
