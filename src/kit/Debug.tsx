import Panel from './Panel'

function Debug() {
  const isEnabled = true

  if (!isEnabled) {
    return null
  }

  return (
    <Panel className="mt-10 text-[12px] break-words opacity-25">
      <h2>Debug</h2>
      <strong>href = </strong>{location.href}
      <br />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <strong>window.Telegram.Webapp = </strong>{JSON.stringify(window.Telegram?.WebApp)}
    </Panel>
  )
}

export default Debug
