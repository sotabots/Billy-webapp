import { useLocation } from 'react-router-dom'
import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'

import i18n from '../i18n'

export const useInit = () => {
  const { txId, setTxId, chat } = useStore()
  const routerLocation = useLocation()
  const [initDataUnsafe/*, initData*/] = useInitData();

  if (txId === undefined) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const txId = queryParameters.get('txid')

    // use `?startapp=...` as id
    const startParam = initDataUnsafe.start_param

    setTxId(txId || startParam || null)
  }

  if (
    chat?.language_code &&
    chat.language_code !== i18n.language &&
    i18n.languages.includes(chat.language_code)
  ) {
    i18n.changeLanguage(chat.language_code)
  }
}
