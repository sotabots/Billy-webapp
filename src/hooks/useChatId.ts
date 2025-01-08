import { useEffect } from 'react'

// import { useGetTx } from '../hooks/useApi'
import { useStore, usePersistStore } from './useStore'

export const useChatId = () => {
  // const { data: tx } = useGetTx()
  const { chatIdStart, selectedChatId } = useStore()
  const { prevChatId, setPrevChatId } = usePersistStore()

  const chatId: number | undefined =
    selectedChatId ||
    chatIdStart ||
    prevChatId ||
    // (!tx ? undefined : tx.chat_id) // todo: need?
    0 // todo: DEMO_CHAT_ID

  useEffect(() => {
    if (chatId !== undefined && chatId !== prevChatId && chatId < -1) {
      setPrevChatId(chatId)
    }
  }, [chatId, prevChatId, setPrevChatId])

  return { chatId }
}
