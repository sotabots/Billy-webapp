import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useGetTransactions, useInit } from '../hooks'
import { Button, DateMark, Header, Page, Transaction } from '../kit'
import { TTransaction } from '../types'

import { ReactComponent as ChevronIcon } from '../assets/chevron.svg'

const groupTransactionsByDate = (transactions: TTransaction[]) => {
  const sortedTransactions = [...transactions].sort((tx1, tx2) => tx1.time_created > tx2.time_created ? -1 : 1)
  const groups = sortedTransactions.reduce((acc, tx) => {
    const dateKey = tx.time_created.split('T')[0]
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(tx)
    return acc
  }, {} as Record<string, TTransaction[]>)

  return Object.keys(groups).map(date => ({
    time: +(new Date(date)),
    txs: groups[date]
  }))
}

export const ConfirmTransactions = () => {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: transactions } = useGetTransactions()

  const unconfirmedTransactions = useMemo(
    () => (transactions || []).filter(tx => !tx.is_confirmed && !tx.is_canceled),
    [transactions]
  )
  const txGroups = useMemo(
    () => groupTransactionsByDate(unconfirmedTransactions),
    [unconfirmedTransactions]
  )

  return (
    <Page>
      <Header
        todoRemove
        onBack={() => { navigate('/summary') }}
      />

      <div className="flex flex-col gap-2">
        <div className="rounded-b-[24px] bg-bg p-4">
          <div className="flex items-center gap-[10px]">
            <Button
              className="flex h-6 w-6 items-center justify-center text-icon"
              onClick={() => { navigate('/summary') }}
            >
              <ChevronIcon className="h-6 w-6 rotate-90" />
            </Button>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-1 pr-[34px]">
              <h3 className="truncate">{t('confirmTransactions')}</h3>
              <div className="flex h-6 min-w-6 items-center justify-center rounded-[16px] bg-separator px-2 text-[12px] leading-4 font-semibold text-textSec2">
                {unconfirmedTransactions.length}
              </div>
            </div>
          </div>
          <div className="mt-4 text-[14px] leading-5 text-textSec2">
            {t('confirmTransactionsDescription')}
          </div>
        </div>

        <div className="min-h-[calc(100vh-264px)] rounded-t-[24px] bg-bg p-4">
          <div className="flex flex-col gap-3">
            {txGroups.length === 0 && (
              <div className="text-textSec2">
                {t('chat.noTransactions')}
              </div>
            )}
            {txGroups.map((txGroup, i) => (
              <div key={`confirm-txGroup-${txGroup.time}-${i}`} className="flex flex-col gap-2">
                <DateMark
                  time={txGroup.time}
                  variant="plain"
                />
                {txGroup.txs.map(tx => (
                  <Transaction
                    key={`ConfirmTransaction-${tx._id}`}
                    tx={tx}
                    showPendingBalance
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}
