import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Panel from './Panel'

import { useStore } from '../store'

const OPEN_DEBUG_RIGHT_CLICKS = 5

function Debug() {
  const { transaction, users, txId, summaryId, summaryCurrencyId, setSummaryCurrencyId, summary, chat, currencies, /*rates,*/ categories, transactions, isDebug, setDebug } = useStore()

  const navigate = useNavigate()

  const [n, setN] = useState(0)

  const isTouchDevice = () =>
    (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0))

  const listener = useCallback(() => {
    if (!isTouchDevice()) {
      const newN = n + 1
      setN(newN)
      if (newN % OPEN_DEBUG_RIGHT_CLICKS === 0) {
        setDebug(!isDebug)
      }
    }
  }, [n, setN, isTouchDevice])

  useEffect(() => {
    window.addEventListener('contextmenu', listener)
    return () => {
      window.removeEventListener('contextmenu', listener)
    }
  }, [listener])

  const out = (title: string, val: any, isOpen?: boolean) => (
    <details open={isOpen}>
      <summary className="select-none"><strong>{title} = </strong></summary>
      {typeof val === 'object' && val !== null
        ? <pre>{JSON.stringify(val, null, 2)}</pre>
        : <pre>{String(val)}</pre>
      }
      <br />
    </details>
  )

  return (
    <div className={cx(!isDebug && 'h-0 overflow-hidden')}>
      <Panel className="mt-10 text-[12px] break-words opacity-70 overflow-x-auto [&>pre]:whitespace-pre-wrap">
        <h2>Debug</h2>
        {false && (
          ['USD', 'EUR', 'RUB', 'ZAR'].map(_ => (
            <button
              key={_}
              className="m-1 p-1 block border border-black"
              onClick={() => { setSummaryCurrencyId(_) }}
            >setSummaryCurrencyId <b>{_}</b></button>
          ))
        )}
        <br />
        <button
          className="m-1 p-1 block border border-black"
          onClick={() => { navigate('/soon') }}
        >
          <b>Go soon</b>
        </button>
        <br />
        {out('window.Telegram?.WebApp', window.Telegram?.WebApp)}
        {out('location.href', location.href)}
        {out('txid', txId)}
        {out('transaction', transaction)}
        {out('users', users)}
        {out('chat', chat)}
        {out('summaryId', summaryId)}
        {out('summaryCurrencyId', summaryCurrencyId)}
        {out('summary', summary)}
        {out('currencies', currencies)}
        {/* {out('rates', rates)} */}
        {out('categories', categories)}
        {out('transactions', transactions)}
      </Panel>
    </div>
  )
}

export default Debug
