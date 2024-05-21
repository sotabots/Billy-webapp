import { useHapticFeedback, useInitData } from '@vkruglikov/react-telegram-web-app'

import cx from 'classnames'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Overlay from '../kit/Overlay'
import Panel from '../kit/Panel'
import Debt from '../kit/Debt'
import DebtDetailed from '../kit/DebtDetailed'
import Divider from '../kit/Divider'
import UserButton from '../kit/UserButton'

import { usePostTransaction, useGetSummary } from '../api'
import { useBalance, useCurrencies, useFeedback, useSummary } from '../hooks'
import { useStore } from '../store'
import { TNewTransaction, TUserId } from '../types'
import { formatAmount, closeApp } from '../utils'

import lottieKoalaSettledUp from '../assets/animation-koala-settled-up.json'
import lottieKoalaSuccess from '../assets/animation-koala-success.json'

function Balance({
  selectedDebtId,
  setSelectedDebtId,
  isRecipientsOpen,
  setIsRecipientsOpen,
  customRecipientId,
  setCustomRecipientId,
  goDetailed,
}: {
  selectedDebtId: null | string
  setSelectedDebtId: (selectedDebtId: null | string) => void
  isRecipientsOpen: boolean
  setIsRecipientsOpen: (isRecipientsOpen: boolean) => void
  customRecipientId: null | TUserId
  setCustomRecipientId: (customRecipientId: null | TUserId) => void
  goDetailed: VoidFunction
}) {
  const { t } = useTranslation()

  const [, notificationOccurred] = useHapticFeedback()
  const [initDataUnsafe] = useInitData()
  const { feedback } = useFeedback()

  const { refetch: refetchSummary } = useGetSummary()
  const { summary, /*setSummary,*/ setSummaryCurrencyId, chat, users, setTxPatchError } = useStore()
  const { getCurrencyById } = useCurrencies()

  const selectedDebt = (summary?.debts || []).find(debt => JSON.stringify(debt) === selectedDebtId)
  const selectedDebtCurrency = selectedDebt ? getCurrencyById(selectedDebt.currency_id) : undefined

  const [isBusy, setIsBusy] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const { balance, balanceFormatted } = useBalance()
  const { debtCurrencyIds } = useSummary()

  const postTransaction = usePostTransaction()

  const settleUp = async () => {
    if (selectedDebtId === null || !summary || !selectedDebt) {
      return
    }
    setIsBusy(true)
    try {
      const newTx: TNewTransaction = {
        _id: 'NEW',
        chat_id: summary.chat_id,
        creator_user_id: initDataUnsafe.user?.id || null,
        editor_user_id: null,
        is_voice: false,
        raw_text: `[Settle up] ${[selectedDebt.from_user.first_name, selectedDebt.from_user.last_name].join(' ')} give ${formatAmount(selectedDebt.amount)} ${selectedDebt.currency_id} ${[selectedDebt.to_user.first_name, selectedDebt.to_user.last_name].join(' ')}`,
        currency_id: selectedDebt.currency_id,
        is_confirmed: true,
        is_canceled: false,
        is_equally: true,
        shares: [
          {
            person_id: `settleup_from_user`,
            related_user_id: selectedDebt.from_user._id,
            amount: selectedDebt.amount,
            is_payer: true,
            raw_name: null,
            normalized_name: null,
            is_fixed_amount: false,
          },
          {
            person_id: `settleup_to_user`,
            related_user_id: customRecipientId || selectedDebt.to_user._id,
            amount: selectedDebt.amount,
            is_payer: false,
            raw_name: null,
            normalized_name: null,
            is_fixed_amount: false,
          }
        ],
        nutshell: null,
        category: null,
        is_settleup: true,
        cashback: null,
      }

      await feedback('confirm_settleup_web', {
        amount_prev: selectedDebt.amount,
        amount_set: selectedDebt.amount, // todo: edited amount
        user_from: selectedDebt.from_user._id,
        user_to_prev: selectedDebt.to_user._id,
        user_to_set: customRecipientId || selectedDebt.to_user._id,
        currency: selectedDebt.currency_id,
      })
      const resJson = await postTransaction(newTx)
      console.log('patchTransaction res', resJson)

      /*
      setSummary({
        ...summary,
        debts: [...summary.debts].filter(debt => JSON.stringify(debt) !== selectedDebtId)
      })
      */
      setIsSuccessOpen(true)
      console.log('success vibro')
      notificationOccurred('success')
      setTimeout(() => {
        setSelectedDebtId(null)
        setCustomRecipientId(null)
        refetchSummary()
      }, 1000)
      setTimeout(() => {
        setIsSuccessOpen(false)
      }, 2500)
    } catch (e) {
      setIsSuccessOpen(false)
      setTxPatchError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }

  const [feedbackData, setFeedbackData] = useState<null | {
    currency: string,
    num_debts_mutli_currency: number
  }>(null)

  useEffect(() => {
    if (feedbackData && chat?.default_currency && summary?.debts && debtCurrencyIds.length === 1 && debtCurrencyIds[0] === chat.default_currency)
    feedback('show_single_currency_balances_web', {
      currency: feedbackData.currency,
      num_debts_mutli_currency: feedbackData.num_debts_mutli_currency,
      num_debts_single_currency: summary.debts.length,
    })
    setFeedbackData(null)
  }, [feedback, feedbackData, setFeedbackData, chat?.default_currency, summary?.debts, debtCurrencyIds])

  if (!summary) {
    return null
  }

  return (
    <>
      {!selectedDebt && summary?.debts && summary.debts.length > 0 && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            <Panel className="!pb-4">
              <div className="flex items-center justify-between">
                <h3 className="capitalize">{t('myBalance')}</h3>
                <div className={cx(
                  'text-[16px] leading-6',
                  balance > 0 && 'text-plus',
                  balance < 0 && 'text-minus',
                )}>
                  {balanceFormatted}
                </div>
              </div>
            </Panel>
            {debtCurrencyIds.map((currencyId, i) => (
              <Panel key={`Panel-${i}`} className="!mt-0">
                <h3>{t('balanceBy')} {getCurrencyById(currencyId)?.symbol || currencyId}</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {summary.debts.filter(item => item.currency_id === currencyId).map(debt => (
                    <Debt
                      key={JSON.stringify(debt)}
                      {...debt}
                      onClick={() => {
                        setSelectedDebtId(JSON.stringify(debt))
                        feedback('settle_up_balances_web', {
                          user: initDataUnsafe.user?.id || null,
                          user_from: debt.from_user._id,
                          user_to: debt.to_user._id,
                          amount: debt.amount,
                          currency: debt.currency_id,
                        })
                      }}
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
              onClick={() => {
                goDetailed()
                feedback('press_details_balances_web')
              }}
            />
          </div>

          {chat?.default_currency && (
            debtCurrencyIds.length > 1 ||
            debtCurrencyIds.length === 1 && debtCurrencyIds[0] !== chat.default_currency
          ) ? (
            <Button
              isBottom
              color={'#7E10E5'}
              text={`💎 ${t('convertAllTo')} ${chat.default_currency}`}
              onClick={() => {
                setFeedbackData({
                  currency: chat.default_currency!,
                  num_debts_mutli_currency: summary.debts.length
                })
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

      {!selectedDebt && summary?.debts && summary.debts.length === 0 && (
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
                onClick={goDetailed}
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

      {!!selectedDebt && !isRecipientsOpen && (
        <>
          <h2 className="mb-2 px-4 pt-[2px] pb-[6px]">
            {`${t('settleUpBy')} ${selectedDebtCurrency?.symbol}`}
          </h2>

          <Panel>
            <DebtDetailed
              {...selectedDebt}
              customRecipientId={customRecipientId}
              onClickRecipient={() => { setIsRecipientsOpen(true) }}
            />
          </Panel>

          <Button
            isBottom
            text={t('settleUp')}
            onClick={settleUp}
            isBusy={isBusy}
          />
        </>
      )}

      {!!selectedDebt && isRecipientsOpen && (
        <>
          <h2 className="mb-2 px-4 pt-[2px] pb-[6px]">{t('selectUser')}</h2>

          <div className="mt-4 overflow-y-auto">
            {users.filter(user => user._id !== selectedDebt.from_user._id).map((user, i, arr) => (
              <>
                <UserButton
                  key={i}
                  user={user}
                  onClick={() => {
                    feedback('set_user_settleup_web', {
                      user_to_prev: selectedDebt.to_user._id,
                      user_to_set: user._id
                    })
                    setCustomRecipientId(user._id)
                    setIsRecipientsOpen(false)
                  }}
                />
                {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
              </>
            ))}
          </div>
        </>
      )}

      <Overlay isOpen={isSuccessOpen}>
        <div className="w-[280px] mx-auto flex flex-col gap-4 pt-[120px] text-center">
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

export default Balance
