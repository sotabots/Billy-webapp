import { useGetTx, useGetSummary } from '../api'

export const useChatId = () => {
  const { data: tx } = useGetTx()
  const { data: summary } = useGetSummary()

  // todo: improve
  const chatId =
    (!tx ? undefined : tx.chat_id) ||
    (!summary ? undefined : summary.chat_id)

  return { chatId }
}
