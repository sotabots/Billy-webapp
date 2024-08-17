import cx from 'classnames'
import { useCallback, useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

import { useChatId } from '../hooks'
import { useStore } from '../store'

import Panel from './Panel'

const OPEN_DEBUG_RIGHT_CLICKS = 5

function Debug() {
  const { transaction, users, txId, summaryId, summaryCurrencyId, setSummaryCurrencyId, summary, chat, currencies, categories, transactions, isDebug, setDebug } = useStore()
  const { chatId } = useChatId()

  // const navigate = useNavigate()

  const [n, setN] = useState(0)

  const listener = useCallback((e: MouseEvent) => {
    if (e.which === 3) {
      const newN = n + 1
      setN(newN)
      if (newN % OPEN_DEBUG_RIGHT_CLICKS === 0) {
        setDebug(!isDebug)
      }
    }
  }, [n, setN])

  useEffect(() => {
    const handler = setTimeout(() => {
      setN(0)
    }, 800)

    return () => {
      clearTimeout(handler)
    }
  }, [n, setN])

  useEffect(() => {
    window.addEventListener('mousedown', listener)
    return () => {
      window.removeEventListener('mousedown', listener)
    }
  }, [listener])

  const out = (title: string, val: any, isOpen?: boolean) => (
    <details open={isOpen}>
      <summary className="select-none font-semibold">{title} =</summary>
      <pre className="p-[0.3em] mb-[1em] leading-[1.1em] whitespace-break-spaces bg-[#8883]">
        {typeof val === 'object' && val !== null
          ? JSON.stringify(val, null, 2)
          : String(val)
        }
      </pre>
    </details>
  )

  if (!isDebug) {
    return null
  }

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
        {/*
        <button
          className="m-1 p-1 block border border-black"
          onClick={() => { navigate('/soon') }}
        >
          <b>Go paywall</b>
        </button>
        <br />
        */}
        <a href="/#/paywall">Go paywall</a>
        <br />
        <br />
        {/* <a href="https://t.me/$57jAnvUn6ElOIwMAscGfUwoljzY">https://t.me/$57jAnvUn6ElOIwMAscGfUwoljzY</a> */}
        {out('window.Telegram?.WebApp', window.Telegram?.WebApp)}
        {out('location.href', location.href)}
        {out('txid', txId)}
        {out('transaction', transaction)}
        {out('users', users)}
        {out('chatId', chatId)}
        {out('chat', chat)}
        {out('summaryId', summaryId)}
        {out('summaryCurrencyId', summaryCurrencyId)}
        {out('summary', summary)}
        {out('currencies', currencies)}
        {out('categories', categories)}
        {out('transactions', transactions)}
      </Panel>
    </div>
  )
}

export default Debug
