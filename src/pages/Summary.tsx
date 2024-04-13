import { useHapticFeedback, useInitData } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Overlay from '../kit/Overlay'
import Panel from '../kit/Panel'
import Debt from '../kit/Debt'
import DebtDetailed from '../kit/DebtDetailed'

import { closeApp } from '../utils'

// import { decimals } from '../const'
import { useStore } from '../store'
import { useCurrencies } from '../hooks'
// import { feedback, EVENT } from '../feedback'
import { usePostTransaction } from '../api'
import { formatAmount } from '../utils'
// import type { TShare } from '../types'

import lottieKoalaSettledUp from '../assets/animation-koala-settled-up.json'
import lottieKoalaSuccess from '../assets/animation-koala-success.json'

import { TNewTransaction } from '../types'

function Summary({
  selectedId,
  setSelectedId,
  goDetailedSummary,
}: {
  selectedId: null | string
  setSelectedId: (selectedId: null | string) => void
  goDetailedSummary: () => void
}) {
  const { t } = useTranslation()

  const [, notificationOccurred] = useHapticFeedback()
  const [initDataUnsafe/*, initData*/] = useInitData();

  const { summary, setSummary, setSummaryCurrencyId, chat } = useStore()
  const { getCurrencyById } = useCurrencies()

  const isSelected = selectedId !== null
  const selectedDebt = (summary?.debts || []).find(debt => JSON.stringify(debt) === selectedId)
  const selectedDebtCurrency = selectedDebt ? getCurrencyById(selectedDebt.currency_id) : undefined

  const [isBusy, setIsBusy] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const currencyIds = !summary?.debts
    ? []
    : [...(new Set(summary.debts.map(item => item.currency_id)))]

  const postTransaction = usePostTransaction()

  /*
  const { currencies, transaction, setTransaction, setSuccess, setTxPatchError } = useStore()

  const patchTransaction = usePatchTransaction()

  const save = async () => {
    const confirmedTransaction = {
      ...transaction,
      is_confirmed: true
    }
    setIsBusy(true)
    try {
      await feedback(EVENT.SEND_TRANSACTION)
      console.log(JSON.stringify(confirmedTransaction, null, 2))
      const resJson = await patchTransaction(confirmedTransaction)
      console.log('patch res json', resJson)
      setSuccess(true)
      setTimeout(() => {
        window.Telegram?.WebApp.close()
      }, 2300)
    } catch (e) {
      setSuccess(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }
  */

  const settleUp = async () => {
    if (selectedId === null || !summary || !selectedDebt) {
      return
    }
    setIsBusy(true)
    try {
      const newTx: TNewTransaction = {
        chat_id: summary.chat_id,
        creator_user_id: initDataUnsafe.user?.id || null,
        is_voice: false,
        raw_text: `[Settle up] ${[selectedDebt.from_user.first_name, selectedDebt.from_user.last_name].join(' ')} give ${formatAmount(selectedDebt.amount)} ${selectedDebt.currency_id} ${[selectedDebt.to_user.first_name, selectedDebt.to_user.last_name].join(' ')}`,
        currency_id: selectedDebt.currency_id,
        is_confirmed: true,
        shares: [
          {
            person_id: `settleup_from_user`,
            related_user_id: selectedDebt.from_user._id,
            amount: selectedDebt.amount,
            is_payer: true,
            raw_name: null,
            normalized_name: null,
            user_candidates: null
          },
          {
            person_id: `settleup_to_user`,
            related_user_id: selectedDebt.to_user._id,
            amount: selectedDebt.amount,
            is_payer: false,
            raw_name: null,
            normalized_name: null,
            user_candidates: null
          }
        ]
      }
      const resJson = await postTransaction(newTx)
      console.log('patchTransaction res', resJson)

      setSummary({
        ...summary,
        debts: [...summary.debts].filter(debt => JSON.stringify(debt) !== selectedId)
      })
      setIsSuccessOpen(true)
      console.log('success vibro')
      notificationOccurred('success')
      setTimeout(() => {
        setSelectedId(null)
      }, 1000)
      setTimeout(() => {
        setIsSuccessOpen(false)
      }, 2500)
    } catch (e) {
      // todo
    } finally {
      setIsBusy(false)
    }
  }

  if (!summary) {
    return null
  }

  return (
    <>
      {!isSelected && summary?.debts && summary.debts.length > 0 && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            {currencyIds.map((currencyId, i) => (
              <Panel key={`Panel-${i}`}>
                <h3>{t('summaryBy')} {getCurrencyById(currencyId)?.symbol || currencyId}</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {summary.debts.filter(item => item.currency_id === currencyId).map(debt => (
                    <Debt
                      key={JSON.stringify(debt)}
                      {...debt}
                      onClick={() => { setSelectedId(JSON.stringify(debt)) }}
                    />
                  ))}
                </div>
              </Panel>
            ))}
          </div>

          <div className="mb-4 flex justify-center">
            <Button
              theme="text"
              text={t('detailedSummary')}
              onClick={goDetailedSummary}
            />
          </div>

          {chat?.default_currency && (
            currencyIds.length > 1 ||
            currencyIds.length === 1 && currencyIds[0] !== chat.default_currency
          ) ? (
            <Button
              isBottom
              color={'#7E10E5'}
              text={`💎 ${t('convertAllTo')} ${chat.default_currency}`}
              onClick={() => {
                setSummaryCurrencyId(chat.default_currency)
              }}
            />
          ) : (
            <Button
              isBottom
              text={t('close')}
              onClick={closeApp}
            />
          )}
        </>
      )}

      {!selectedId && summary?.debts && summary.debts.length === 0 && (
        <>
          <div className="w-[244px] mx-auto flex flex-col gap-6 pt-8 text-center">
            <div className="mx-auto w-[215px] h-[200px]">
              <Lottie
                style={{ width: 215, height: 200 }}
                animationData={lottieKoalaSettledUp}
                loop={true}
              />
            </div>
            <div className="text-[24px] leading-[32px] font-semibold">
              {t('allSettledUp')}
            </div>
            <div className="mb-4">
              <Button
                theme="text"
                text={t('detailedSummary')}
                onClick={goDetailedSummary}
              />
            </div>
          </div>

          <Button
            isBottom
            text={t('close')}
            onClick={closeApp}
          />
        </>
      )}

      {selectedId && selectedDebt && (
        <>
          <h2 className="mb-2 px-4 pt-[2px] pb-[6px]">
            {`${t('settleUpBy')} ${selectedDebtCurrency?.symbol}`}
          </h2>

          <Panel>
            <DebtDetailed {...selectedDebt} />
          </Panel>

          <Button
            isBottom
            text={t('settleUp')}
            onClick={settleUp}
            isBusy={isBusy}
          />
        </>
      )}

      <Overlay isOpen={isSuccessOpen}>
        <div className="w-[280px] mx-auto flex flex-col gap-4 pt-8 text-center">
          <div className="mx-auto w-[286px] h-[237px]">
            <Lottie
              style={{ width: 286, height: 237 }}
              animationData={lottieKoalaSuccess}
              loop={true}
            />
          </div>
          <div className="text-[24px] leading-[32px] font-semibold">
            {t('settleUpSaved')}
          </div>
        </div>
      </Overlay>
    </>
  )
}

export default Summary
