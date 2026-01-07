import { useEffect } from 'react'
import { useStore } from './useStore'
import { getInitialBackend } from '../api/backendConfig'

export const useApiUrlInit = () => {
  const { apiUrl, setApiUrl } = useStore()

  useEffect(() => {
    if (!apiUrl) {
      const initial = getInitialBackend()
      if (initial) {
        setApiUrl(initial)
      }
    }
  }, [apiUrl, setApiUrl])
}
