import { useLocation } from 'react-router-dom'

import { useStore } from '../store'

export const useInit = () => {
  const { txId, setTxId } = useStore()
  const routerLocation = useLocation()

  if (txId === undefined) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const txId = queryParameters.get('txid')
    setTxId(txId || null)
  }
}
