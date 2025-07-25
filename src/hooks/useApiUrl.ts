import { useEffect } from 'react'
import { useStore } from './useStore'

const baseApiUrl: string | undefined = import.meta.env.VITE_API_URL
const fallbackApiUrl: string | undefined = import.meta.env.VITE_FALLBACK_API_URL

export const useApiUrlInit = () => {
  const {
    setApiUrl,
    isApiFallbackRequest, setIsApiFallbackRequest
  } = useStore()

  useEffect(() => {
    async function check() {
      if (!isApiFallbackRequest) {
        console.log('healthcheck start')
        setIsApiFallbackRequest(true)

        let isOk = true
        try {
          isOk = await new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => {
              console.log('healthcheck timeout')
              resolve(false)
            }, 3000)
            fetch(baseApiUrl + '/currencies/?health', {}).then(async (res) => {
              console.log(`healthcheck res.ok ${res.ok}`)
              await res.json()
              console.log('healthcheck json ok')
              clearTimeout(timer)
              resolve(true)
            })
          })
        } catch (e) {
          console.error('healthcheck e', e)
        }

        console.log('healthcheck isOk', isOk)
        const newUrl = (isOk ? baseApiUrl : fallbackApiUrl) || ''
        console.log('healthcheck setApiUrl', newUrl)
        setApiUrl(newUrl)
      }
    }
    check()
  }, [isApiFallbackRequest,setIsApiFallbackRequest, setApiUrl])
}
