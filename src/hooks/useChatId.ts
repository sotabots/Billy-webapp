// import { useGetTx } from '../hooks/useApi'
import { useStore } from './'

export const useChatId = () => {
  // const { data: tx } = useGetTx()
  const { chatIdStart } = useStore()

  const chatId: number | undefined =
    chatIdStart // ||
    // (!tx ? undefined : tx.chat_id) // todo: need?
    || 0

  return { chatId }
}
