import { useEffect } from 'react'

import { useStore, usePersistStore } from './useStore'

export const useChatId = () => {
  const { chatIdStart, selectedChatId } = useStore()
  const { prevChatId, setPrevChatId } = usePersistStore()

  const chatId: number | undefined =
    selectedChatId ||
    chatIdStart ||
    prevChatId ||
    0 // todo: DEMO_CHAT_ID

  useEffect(() => {
    if (chatId !== undefined && chatId !== prevChatId && chatId < -1) {
      setPrevChatId(chatId)
    }
  }, [chatId, prevChatId, setPrevChatId])

  return { chatId }
}
