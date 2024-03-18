import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import Panel from './Panel'

import { useStore } from '../store'

const OPEN_DEBUG_RIGHT_CLICKS = 5

function Debug() {
  const { transaction, users, txId, summaryId, summaryCurrencyId, setSummaryCurrencyId, summary, chat } = useStore()
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

  const out = (title: string, val: any) => (
    <>
      <br />
      <strong>⚫ {title} = </strong>
      {typeof val === 'object' && val !== null
        ? <pre>{JSON.stringify(val, null, 2)}</pre>
        : String(val)
      }
      <br />
    </>
  )

  return (
    <div className={cx(n < OPEN_DEBUG_RIGHT_CLICKS && 'h-0 overflow-hidden')}>
      <Panel className="mt-10 text-[12px] break-words opacity-70 overflow-x-auto [&>pre]:whitespace-pre-wrap">
        <h2>Debug</h2>
        {['USD', 'EUR', 'RUB', 'ZAR'].map(_ => (
          <button
            className="m-1 p-1 block border border-black"
            onClick={() => { setSummaryCurrencyId(_) }}
          >setSummaryCurrencyId <b>{_}</b></button>
        ))}
        {out('location.href', location.href)}
        {out('txid', txId)}
        {out('transaction', transaction)}
        {out('users', users)}
        {out('chat', chat)}
        {out('summaryId', summaryId)}
        {out('summaryCurrencyId', summaryCurrencyId)}
        {out('summary', summary)}
        {out('window.Telegram?.WebApp', window.Telegram?.WebApp)}
      </Panel>
    </div>
  )
}

export default Debug
