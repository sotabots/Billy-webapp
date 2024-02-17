import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import Panel from './Panel'

import { useStore } from '../store'

const OPEN_DEBUG_RIGHT_CLICKS = 5

function Debug() {
  const { transaction, users, txId, summaryId, summary, chat } = useStore()
  const [n, setN] = useState(0)

  const isTouchDevice = () =>
    (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0))

  const listener = useCallback(() => {
    if (!isTouchDevice()) {
      setN(n + 1)
    }
  }, [n, setN, isTouchDevice])

  useEffect(() => {
    window.addEventListener('contextmenu', listener)
    return () => {
      window.removeEventListener('contextmenu', listener)
    }
  }, [listener])

  return (
    <div className={cx(n < OPEN_DEBUG_RIGHT_CLICKS && 'h-0 overflow-hidden')}>
      <Panel className="mt-10 text-[12px] break-words opacity-40 overflow-x-auto">
        <h2>Debug</h2>
        <strong>href = </strong>{location.href}
        <br />
        <br />
        <strong>summaryId = </strong>{String(summaryId)}
        <br />
        <strong>summary = </strong>
        <pre>{JSON.stringify(summary, null, 2)}</pre>
        <br />
        <br />
        <strong>txId = </strong>{String(txId)}
        <br />
        <strong>transaction = </strong>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
        <br />
        <br />
        <strong>users = </strong>
        <pre>{JSON.stringify(users, null, 2)}</pre>
        <br />
        <br />
        <strong>chat = </strong>
        <pre>{JSON.stringify(chat, null, 2)}</pre>
        <br />
        <br />
        <strong>window.Telegram?.WebApp = </strong>
        <pre>{JSON.stringify(window.Telegram?.WebApp, null, 2)}</pre>
      </Panel>
    </div>
  )
}

export default Debug
