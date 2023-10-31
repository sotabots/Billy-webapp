import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import Panel from './Panel'

import { useStore } from '../store'

function Debug() {
  const { transaction, users, txId } = useStore()
  const [n, setN] = useState(0)

  const listener = useCallback(() => {
    setN(n + 1)
  }, [n, setN])

  useEffect(() => {
    window.addEventListener('contextmenu', listener)
    return () => {
      window.removeEventListener('contextmenu', listener)
    }
  }, [listener])

  return (
    <div className={cx(n < 5 && 'h-0 overflow-hidden')}>
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
    </div>
  )
}

export default Debug
