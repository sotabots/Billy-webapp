import { useLocation } from 'react-router-dom'
import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'

import i18n from '../i18n'

export const useInit = () => {
  const { txId, setTxId, chat } = useStore()
  const routerLocation = useLocation()
  const [initDataUnsafe/*, initData*/] = useInitData();

  const queryParameters = new URLSearchParams(routerLocation.search)
  const queryTxId = queryParameters.get('txid')

  const startParam = initDataUnsafe.start_param
  // use `?startapp=...` as id
  // todo: decode
  const startParamTxId = startParam

  if (txId === undefined) {
    setTxId(queryTxId || startParamTxId || null)
  }

  if (
    chat?.language_code &&
    chat.language_code !== i18n.language &&
    i18n.languages.includes(chat.language_code)
  ) {
    i18n.changeLanguage(chat.language_code)
  }
}
