export const usePlatform = () => {
  const isTg = window.Telegram?.WebApp.platform !== 'unknown'

  return { isTg }
}
