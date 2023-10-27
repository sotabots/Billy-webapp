import { useLocation } from 'react-router-dom'
import { useInitData } from '@vkruglikov/react-telegram-web-app'

import { useStore } from '../store'

export const useInit = () => {
  const { txId, setTxId } = useStore()
  const routerLocation = useLocation()
  const [initDataUnsafe/*, initData*/] = useInitData();

  if (txId === undefined) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const txId = queryParameters.get('txid')

    // use `?startapp=...` as id
    const startParam = initDataUnsafe.start_param

    setTxId(txId || startParam || null)
  }
}
