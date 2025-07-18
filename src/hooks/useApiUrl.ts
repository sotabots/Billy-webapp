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
      console.log('check')
      if (!isApiFallbackRequest) {
        console.log('check in')
        setIsApiFallbackRequest(true)

        let response: Response | null = null
        try {
          response = await new Promise( (resolve, reject) => {
            const timer = setTimeout(() => {
              console.log('check timeout')
              reject(new Error('TIMEOUT'))
            }, 2000)
            fetch(baseApiUrl + '/health', {}).then((res) => {
              clearTimeout(timer)
              resolve(res)
            })
          })
        } catch (e) {
          console.error('check catch e', e)
        }

        const newUrl = (response && response.ok ? baseApiUrl : fallbackApiUrl) || ''
        console.log('check setApiUrl', newUrl)
        setApiUrl(newUrl)
      }
    }
    check()
  }, [isApiFallbackRequest,setIsApiFallbackRequest, setApiUrl])
}
