import { useEffect } from 'react'
import { useStore } from './useStore'

const apiUrl = import.meta.env.VITE_API_URL
const fallbackApiUrl = import.meta.env.VITE_FALLBACK_API_URL

const fetchWithTimeout = (url: string, timeout: number, options: RequestInit) => {
  return new Promise<Response>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'))
    }, timeout)

    return fetch(url, options)
      .then(response => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch(err => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

export const useApiUrl = () => {
  const {
    isApiFallback, setIsApiFallback,
    isApiFallbackRequest, setIsApiFallbackRequest
  } = useStore()

  useEffect(() => {
    async function check() {
      if (!isApiFallbackRequest) {
        setIsApiFallbackRequest(true)
        const response = await fetchWithTimeout(apiUrl + '/health', 2000, {})
        setIsApiFallback(!response.ok)
      }
    }
    check()
  }, [isApiFallback, isApiFallbackRequest, setIsApiFallback, setIsApiFallbackRequest])

  return {
    apiUrl: isApiFallback === undefined ? undefined
      : isApiFallback ? fallbackApiUrl  : apiUrl
  }
}
