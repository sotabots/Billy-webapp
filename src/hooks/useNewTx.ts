import { useChatId, useUsers, useGetChat, useAuth } from '../hooks'
import type { TNewTransaction } from '../types'

export const useNewTx = () => {
  const { chatId } = useChatId()
  const { getUserById } = useUsers()
  const { data: chat } = useGetChat()

  const { userId } = useAuth()
  const user = userId && getUserById(userId) // is user in chat?
    || getUserById(1000) // Demo Pavel shares
    || null

  const newTx: TNewTransaction = {
    _id: 'NEW',
    chat_id: chatId || null,
    creator_user_id: userId || null,
    editor_user_id: null,
    is_voice: false,
    raw_text: '',
    currency_id: chat?.last_used_currency_id || null,
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
    is_personal: false,
    cashback: null,
  }

  return { newTx }
}
