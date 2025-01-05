export const useBack = () => {
  const isBack: boolean = history.state && history.state?.idx && history.state?.idx !== 0

  const goBack: (() => void ) | undefined = isBack
    ? () => { history.back() }
    : undefined

  return { goBack }
}
