import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { /*useChatId,*/ useUsers, useStore, useGetSummary } from '../hooks'
import type { TNewTransaction } from '../types'

export const useNewTx = () => {
  const [initDataUnsafe] = useInitData()
  const { chat } = useStore()
  const { data: summary } = useGetSummary()
  // const { chatId } = useChatId() // recursion
  const { getUserById } = useUsers()

  const userId = initDataUnsafe.user?.id
  const user = userId && getUserById(userId) // is user in chat?
    || getUserById(1000) // Demo Pavel shares
    || null

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
    is_equally: true,
    shares: !user ? [] : [true/*, false*/].map(isPayer => (
      {
        person_id: `author-person-user-${user._id}`,
        raw_name: null,
        normalized_name: null,
        is_payer: isPayer,
        amount: 0,
        related_user_id: user._id,
        is_fixed_amount: false,
      }
    )),
    nutshell: null,
    category: null,
    is_settleup: false,
    cashback: null,
  }

  return { newTx }
}
