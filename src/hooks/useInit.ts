import { useLocation } from 'react-router-dom'

import { useStore } from '../store'

export const useInit = () => {
  const { txId, setTxId } = useStore()
  const routerLocation = useLocation()

  if (txId === undefined) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const txId = queryParameters.get('txid')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const startParam = window?.Telegram?.Webapp.start_param
    // use `?start_param=...` as id
    setTxId(txId || startParam || null)
  }
}
