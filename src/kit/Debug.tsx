import Panel from './Panel'

import { useStore } from '../store'

function Debug() {
  const isEnabled = true

  const { transaction, users, txId } = useStore()

  if (!isEnabled) {
    return null
  }

  return (
    <Panel className="mt-10 text-[12px] break-words opacity-40 overflow-x-auto">
      <h2>Debug</h2>
      <strong>href = </strong>{location.href}
      <br />
      <br />
      <strong>txid = </strong>{String(txId)}
      <br />
      <br />
      <strong>transaction = </strong>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
      <br />
      <br />
      <strong>users = </strong>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <br />
      <br />
      <strong>window.Telegram.Webapp = </strong>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
    </Panel>
  )
}

export default Debug
