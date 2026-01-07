const STORAGE_KEY = 'billy.apiUrl'

const normalizeBackendUrl = (url: string) => url.replace(/\/+$/, '')

const uniqueOrdered = (values: string[]) => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    if (!seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

const splitList = (value: string | undefined) =>
  (value || '')
    .split(/[,\s]+/g)
    .map(s => s.trim())
    .filter(Boolean)

export const CONFIGURED_BACKENDS: string[] = uniqueOrdered([
  ...splitList(import.meta.env.VITE_API_URLS),
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_FALLBACK_API_URL,
]
  .filter((v): v is string => typeof v === 'string' && v.length > 0)
  .map(normalizeBackendUrl))

export const getConfiguredBackends = () => CONFIGURED_BACKENDS

export const getCachedBackend = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return undefined
    const normalized = normalizeBackendUrl(cached)
    return CONFIGURED_BACKENDS.includes(normalized) ? normalized : undefined
  } catch {
    return undefined
  }
}

export const cacheBackend = (backend: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, normalizeBackendUrl(backend))
  } catch {
    // ignore
  }
}

export const getInitialBackend = () => {
  const cached = getCachedBackend()
  return cached || CONFIGURED_BACKENDS[0]
}

export const normalizeApiUrl = normalizeBackendUrl

