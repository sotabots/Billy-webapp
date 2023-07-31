import Panel from './Panel'

import { useStore } from '../store'

function Debug() {
  const isEnabled = true

  const { transaction } = useStore()

  if (!isEnabled) {
    return null
  }

  return (
    <Panel className="mt-10 text-[12px] break-words opacity-25">
      <h2>Debug</h2>
      <strong>href = </strong>{location.href}
      <br />
      <br />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <strong>window.Telegram.Webapp = </strong>{JSON.stringify(window.Telegram?.WebApp)}
      <br />
      <br />
      <strong>transaction = </strong>{JSON.stringify(transaction)}
    </Panel>
  )
}

export default Debug
