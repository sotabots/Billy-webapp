import { useLocation } from 'react-router-dom'

import { useStore } from '../store'

export const useInit = () => {
  const { txId, setTxId } = useStore()
  const routerLocation = useLocation()

  if (!txId) {
    const queryParameters = new URLSearchParams(routerLocation.search)
    const getTxid = queryParameters.get('txid')

    setTxId(getTxid || null)
  }
}
