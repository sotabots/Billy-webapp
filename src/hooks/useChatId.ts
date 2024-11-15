// import { useGetTx } from '../hooks/useApi'
import { useStore } from './'

export const useChatId = () => {
  // const { data: tx } = useGetTx()
  const { chatIdStart, selectedChatId } = useStore()

  const chatId: number | undefined =
    chatIdStart ||
    // (!tx ? undefined : tx.chat_id) // todo: need?
    selectedChatId ||
    0 // todo: DEMO_CHAT_ID

  return { chatId }
}
