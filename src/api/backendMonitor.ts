import { CONFIGURED_BACKENDS, cacheBackend, normalizeApiUrl } from './backendConfig'
import { useStore } from '../hooks/useStore'

const HEALTHCHECK_PATH = '/currencies/?health'
const CONNECT_TIMEOUT_MS = 2000
const HEALTHCHECK_TIMEOUT_MS = 3000

const BACKOFF_DELAYS_MS = [100, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000]

let checkInFlight: Promise<string | null> | null = null
let nextAllowedCheckAt = 0
let backoffIndex = 0

const getUrlString = (input: RequestInfo | URL) => {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  return input.url
}

const matchBackendForUrl = (url: string) => {
  let bestMatch: string | undefined
  for (const backend of CONFIGURED_BACKENDS) {
    if (url === backend || url.startsWith(`${backend}/`) || url.startsWith(`${backend}?`) || url.startsWith(`${backend}#`)) {
      if (!bestMatch || backend.length > bestMatch.length) {
        bestMatch = backend
      }
    }
  }
  return bestMatch
}

const shouldMonitorUrl = (url: string) => !!matchBackendForUrl(url)

const healthcheckBackend = async (backend: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS)

  try {
    const res = await fetch(`${backend}${HEALTHCHECK_PATH}`, { signal: controller.signal })
    if (!res.ok) return false
    try {
      await res.json()
    } catch {
      // ignore JSON parsing failures
    }
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeoutId)
  }
}

const findWorkingBackend = async () => {
  return new Promise<string | null>((resolve) => {
    let pending = CONFIGURED_BACKENDS.length
    let resolved = false

    if (!pending) {
      resolve(null)
      return
    }

    for (const backend of CONFIGURED_BACKENDS) {
      healthcheckBackend(backend)
        .then((ok) => {
          pending -= 1
          if (!resolved && ok) {
            resolved = true
            resolve(backend)
            return
          }
          if (!resolved && pending === 0) {
            resolve(null)
          }
        })
        .catch(() => {
          pending -= 1
          if (!resolved && pending === 0) {
            resolve(null)
          }
        })
    }
  })
}

export const triggerBackendRecheck = () => {
  if (CONFIGURED_BACKENDS.length <= 1) return

  const now = Date.now()
  if (checkInFlight) return
  if (now < nextAllowedCheckAt) return

  const delay = BACKOFF_DELAYS_MS[Math.min(backoffIndex, BACKOFF_DELAYS_MS.length - 1)]
  nextAllowedCheckAt = now + delay
  backoffIndex = Math.min(backoffIndex + 1, BACKOFF_DELAYS_MS.length - 1)

  const before = normalizeApiUrl(useStore.getState().apiUrl || '')

  checkInFlight = (async () => {
    const backend = await findWorkingBackend()
    if (!backend) return null

    const normalized = normalizeApiUrl(backend)
    const { apiUrl, setApiUrl } = useStore.getState()

    if (normalizeApiUrl(apiUrl || '') !== normalized) {
      setApiUrl(normalized)
      backoffIndex = 0
      nextAllowedCheckAt = 0
    } else {
      cacheBackend(normalized)
    }

    if (before !== normalized) {
      console.log('backend switched', before, '->', normalized)
    }

    return normalized
  })()
    .finally(() => {
      checkInFlight = null
    })
}

export const backendFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = getUrlString(input)
  if (!shouldMonitorUrl(url)) {
    return fetch(input, init)
  }

  let settled = false
  const connectTimer = setTimeout(() => {
    if (!settled) {
      triggerBackendRecheck()
    }
  }, CONNECT_TIMEOUT_MS)

  try {
    const res = await fetch(input, init)
    settled = true
    clearTimeout(connectTimer)

    if (res.ok) {
      const backend = matchBackendForUrl(url)
      if (backend) {
        cacheBackend(backend)
      }
    }

    return res
  } catch (e) {
    settled = true
    clearTimeout(connectTimer)
    if (!(e instanceof DOMException && e.name === 'AbortError')) {
      triggerBackendRecheck()
    }
    throw e
  }
}
