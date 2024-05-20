import { useGetTx, useGetSummary } from '../api'
import { useStore } from '../store'

export const useChatId = () => {
  const { data: tx } = useGetTx()
  const { data: summary } = useGetSummary()
  const { chatIdStart } = useStore()

  // todo: improve
  const chatId =
    chatIdStart ||
    (!tx ? undefined : tx.chat_id) ||
    (!summary ? undefined : summary.chat_id)

  return { chatId }
}
