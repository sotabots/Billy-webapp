import { useGetTx, useGetSummary } from '../hooks/useApi'
import { useStore } from './'

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
