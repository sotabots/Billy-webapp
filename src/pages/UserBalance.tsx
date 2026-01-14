import { useHapticFeedback, useShowPopup } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useStore, useCurrencies, useFeedback, useSummary, usePostTransaction, useGetSummary, useGetTransactions, useGetProfile, useGetUsers, useUsers, useAuth, useGetUserSettings, useTgSettings, useUser } from '../hooks'
import { Button, Overlay, Panel, DebtDetailed, Divider, UserButton, Currencies, CurrencyAmount, Debt, Tabs, CustomHeader } from '../kit'
import { TCurrencyId, TDebt, TNewTransaction, TUserId } from '../types'
import { formatAmount, closeApp } from '../utils'

import lottieKoalaSettledUp from '../assets/animation-koala-settled-up.json'
import lottieKoalaSuccess from '../assets/animation-koala-success.json'

export const UserBalance = ({
  isCurrencyOpen,
  setIsCurrencyOpen,
  selectedDebtId,
  setSelectedDebtId,
  isRecipientsOpen,
  setIsRecipientsOpen,
  customRecipientId,
  setCustomRecipientId,
  focusUserId,
}: {
  isCurrencyOpen: boolean
  setIsCurrencyOpen: (isCurrencyOpen: boolean) => void
  selectedDebtId: null | string
  setSelectedDebtId: (selectedDebtId: null | string) => void
  isRecipientsOpen: boolean
  setIsRecipientsOpen: (isRecipientsOpen: boolean) => void
  customRecipientId: null | TUserId
  setCustomRecipientId: (customRecipientId: null | TUserId) => void
  focusUserId?: TUserId | null
}) => {
  const { t } = useTranslation()
  const showPopup = useShowPopup()
  const [, notificationOccurred] = useHapticFeedback()
  const { userId } = useAuth()
  const { me } = useUser()
  const { feedback } = useFeedback()
  const { goSettings } = useTgSettings()

  const {
    summaryCurrencyId, setSummaryCurrencyId,
    summaryPrevCurrencyId, setSummaryPrevCurrencyId,
    setTxPatchError,
  } = useStore()

  const { refetch: refetchTransactions } = useGetTransactions()
  const { data: summary, refetch: refetchSummary } = useGetSummary({ otherUserId: focusUserId ?? null })
  const { data: users } = useGetUsers()
  const { data: userSettings } = useGetUserSettings()
  const { refetch: refetchProfile } = useGetProfile()
  const { getCurrencyById } = useCurrencies()

  const debtDetails: TDebt[] = summary?.balance.debt.details || []
  const creditDetails: TDebt[] = summary?.balance.credit.details || []

  const selectedDebt: TDebt | undefined = ([
    ...debtDetails,
    ...creditDetails, // todo: remove after 'remind'
  ]).find(debt => JSON.stringify(debt) === selectedDebtId)
  const selectedDebtCurrency = selectedDebt ? getCurrencyById(selectedDebt.value_primary.currency_id) : undefined
  const [selectedDebtAmount, setSelectedDebtAmount] = useState<number>(0)

  useEffect(() => {
    if (selectedDebt) {
      setSelectedDebtAmount(Math.abs(selectedDebt.value_primary.amount))
    }
  }, [selectedDebt])

  const [isOriginalCurrencies, setIsOriginalCurrencies] = useState(false)

  const [isBusy, setIsBusy] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  const { debtCurrencyIds, debts } = useSummary()

  const postTransaction = usePostTransaction()

  const { getUserById } = useUsers()
  const fromUser = getUserById(selectedDebt?.from_user_id || 0)
  const toUser = getUserById(selectedDebt?.to_user_id || 0)
  const focusUser = focusUserId ? getUserById(focusUserId) : undefined
  const focusUserName: string = focusUser?.shortened_name || focusUser?.first_name || ''

  const titleDebts = focusUserId
    ? t('userBalance.userOwes', { name: focusUserName })
    : t('userBalance.iOwe')
  const titleCredits = focusUserId
    ? t('userBalance.owedToUser', { name: focusUserName })
    : t('userBalance.owedToMe')
  const titleTotalDebts = focusUserId
    ? t('userBalance.totalUserOwes', { name: focusUserName })
    : t('userBalance.totalIOwe')
  const titleTotalCredits = focusUserId
    ? t('userBalance.totalOwedToUser', { name: focusUserName })
    : t('userBalance.totalOwedToMe')

  const rewriteOnMe = async () => {
    if (!summary || !focusUserId || !userId || !me || !focusUser) {
      return
    }

    const totalAmount: number = summary.balance.total.value.amount
    const currencyId: TCurrencyId = summary.balance.total.value.currency_id
    const absAmount: number = Math.abs(totalAmount)

    if (!absAmount) {
      return
    }

    const myName = me.shortened_name || me.first_name || ''
    const otherName = focusUser.shortened_name || focusUser.first_name || ''

    const isOtherOwes = totalAmount < 0
    const payerId: TUserId = isOtherOwes ? focusUserId : userId
    const receiverId: TUserId = isOtherOwes ? userId : focusUserId

    const newTx: TNewTransaction = {
      _id: 'NEW',
      chat_id: summary.chat_id,
      creator_user_id: userId,
      editor_user_id: null,
      is_voice: false,
      raw_text: `${otherName} <> ${myName}`,
      currency_id: currencyId,
      is_confirmed: true,
      is_canceled: false,
      is_equally: true,
      shares: [
        {
          person_id: 'rewrite_on_me_from_user',
          related_user_id: payerId,
          amount: absAmount,
          is_payer: true,
          raw_name: null,
          normalized_name: null,
          is_fixed_amount: false,
        },
        {
          person_id: 'rewrite_on_me_to_user',
          related_user_id: receiverId,
          amount: absAmount,
          is_payer: false,
          raw_name: null,
          normalized_name: null,
          is_fixed_amount: false,
        }
      ],
      nutshell: null,
      category: null,
      is_settleup: true,
      is_personal: false,
      cashback: null,
    }

    setIsBusy(true)
    try {
      await postTransaction(newTx)
      setIsSuccessOpen(true)
      notificationOccurred('success')
      setTimeout(() => {
        refetchSummary()
        refetchTransactions()
        refetchProfile()
      }, 500)
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

  const handleRewriteOnMeClick = async () => {
    const message = t('userBalance.rewriteOnMeConfirm')
    let answerButtonId: string
    try {
      answerButtonId = await showPopup({
        message,
        buttons: [
          {
            id: 'cancel',
            text: t('cancel'),
            type: 'default',
          },
          {
            id: 'confirm',
            text: t('userBalance.rewriteOnMeConfirmYes'),
            type: 'default',
          },
        ],
      })
    } catch {
      answerButtonId = confirm(message) ? 'confirm' : 'cancel'
    }

    if (answerButtonId === 'confirm') {
      rewriteOnMe()
    }
  }

  const settleUp = async () => {
    if (selectedDebtId === null || !summary || !selectedDebt) {
      return
    }
    setIsBusy(true)
    try {
      const newTx: TNewTransaction = {
        _id: 'NEW',
        chat_id: summary.chat_id,
        creator_user_id: userId || null,
        editor_user_id: null,
        is_voice: false,
        raw_text: `[Settle up] ${[fromUser?.first_name, fromUser?.last_name].join(' ')} give ${formatAmount(selectedDebtAmount)} ${selectedDebt.value_primary.currency_id} ${[toUser?.first_name, toUser?.last_name].join(' ')}`,
        currency_id: selectedDebt.value_primary.currency_id,
        is_confirmed: true,
        is_canceled: false,
        is_equally: true,
        shares: [
          {
            person_id: 'settleup_from_user',
            related_user_id: selectedDebt.from_user_id,
            amount: selectedDebtAmount,
            is_payer: true,
            raw_name: null,
            normalized_name: null,
            is_fixed_amount: false,
          },
          {
            person_id: 'settleup_to_user',
            related_user_id: customRecipientId || selectedDebt.to_user_id,
            amount: selectedDebtAmount,
            is_payer: false,
            raw_name: null,
            normalized_name: null,
            is_fixed_amount: false,
          }
        ],
        nutshell: null,
        category: null,
        is_settleup: true,
        is_personal: false,
        cashback: null,
      }

      await feedback('confirm_settleup_web', {
        amount_prev: selectedDebt.value_primary.amount,
        amount_set: selectedDebtAmount,
        user_from: selectedDebt.from_user_id,
        user_to_prev: selectedDebt.to_user_id,
        user_to_set: customRecipientId || selectedDebt.to_user_id,
        currency: selectedDebt.value_primary.currency_id,
      })
      const resJson = await postTransaction(newTx)
      console.log('patchTransaction res', resJson)

      setIsSuccessOpen(true)
      console.log('success vibro')
      notificationOccurred('success')
      setTimeout(() => {
        setSelectedDebtId(null)
        setCustomRecipientId(null)
        refetchSummary()
        refetchTransactions()
        refetchProfile()
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
    // num_debts_mutli_currency: number
  }>(null)

  useEffect(() => {
    if (feedbackData && summaryCurrencyId && debts && debtCurrencyIds.length === 1 && debtCurrencyIds[0] === summaryCurrencyId)
    feedback('show_single_currency_balances_web', {
      currency: feedbackData.currency,
      // todo: fix
      // num_debts_mutli_currency: feedbackData.num_debts_mutli_currency,
      // num_debts_single_currency: summary.debts.length,
    })
    setFeedbackData(null)
  }, [feedback, feedbackData, setFeedbackData, summaryCurrencyId, debts, debtCurrencyIds])

  useEffect(() => {
    if (summaryCurrencyId) {
      setSummaryPrevCurrencyId(summaryCurrencyId)
    }
  }, [summaryCurrencyId, setSummaryPrevCurrencyId])

  useEffect(() => {
    if (!isOriginalCurrencies) {
      if (userSettings?.currency && summaryCurrencyId === null) {
        setSummaryCurrencyId(summaryPrevCurrencyId || userSettings.currency)
      }
    } else {
      setSummaryCurrencyId(null)
    }
  }, [userSettings?.currency, setSummaryCurrencyId, summaryCurrencyId, isOriginalCurrencies, summaryPrevCurrencyId])


  
  if (!summary) {
    return null
  }

  if (isCurrencyOpen) {
    return (
      <>
        <div className=" flex items-center justify-between gap-3 px-4">
          <h2>{t('selectCurrency')}</h2>
          {summaryCurrencyId !== null && !!userSettings?.currency && summaryCurrencyId !== userSettings.currency &&
            <Button
              className="flex items-center justify-center gap-[2px] px-2 text-blue"
              onClick={() => {
                setSummaryCurrencyId(userSettings.currency)
                setIsCurrencyOpen(false)
                refetchSummary()
              }}
            >
              {t('reset')}
            </Button>
          }
        </div>
        <Currencies
          className="mt-4"
          value={summaryCurrencyId}
          onChange={(currencyId: TCurrencyId) => {
            setFeedbackData({
              currency: currencyId,
              // num_debts_mutli_currency: summary.debts.length
            })
            setSummaryCurrencyId(currencyId)
            setIsCurrencyOpen(false)
            refetchSummary()
          }}
        />
      </>
    )
  }

  const isTotal: boolean = debtDetails.length > 0 && creditDetails.length > 0

  const isItems: undefined | boolean =
    !!summary && (!!debtDetails.length || !!creditDetails.length)

  const isCalcInMyCurrency: boolean = summaryCurrencyId === userSettings?.currency

  const computedDebtValue = summary.balance.debt.value
  const computedCreditValue = summary.balance.credit.value
  const computedTotalValue = summary.balance.total.value
  const canRewriteOnMe: boolean =
    !!focusUserId &&
    !!computedTotalValue.amount &&
    !!userId &&
    !!me &&
    !!focusUser &&
    !isBusy

  return (
    <>
      {!selectedDebt && !isCurrencyOpen &&
        <CustomHeader
          center={
            summaryCurrencyId === null
              ? t('userBalance.titleOriginalCurrencies')
              : t('userBalance.title')}
          onBack={
            (isOriginalCurrencies && isItems)
              ? () => { setIsOriginalCurrencies(false) }
              : undefined}
        />
      }

      {!selectedDebt && !!isItems && (
        <>
          <div className="flex flex-col gap-2 pb-5">
            {false &&
              <Tabs
                items={[
                  {
                    title: t('userBalance.inMyCurrency'),
                    isActive: summaryCurrencyId !== null,
                    onClick: () => {
                      setIsOriginalCurrencies(false)
                    },
                  },
                  {
                    title: t('userBalance.inOriginalCurrencies'),
                    isActive: summaryCurrencyId === null,
                    onClick: () => {
                      setIsOriginalCurrencies(true)
                    },
                  },
                ]}
              />
            }

            {!!summaryCurrencyId &&
              <Panel className="!pb-4">
                <div className="flex flex-col gap-2">
                  <h3 className="">
                    {t(isCalcInMyCurrency ? 'userBalance.calcInMyCurrency' : 'userBalance.calcInCurrency', { currency: summaryCurrencyId })}
                  </h3>
                  <div className="flex flex-col gap-2 text-[14px] leading-[20px] text-textSec2">
                    <div>
                      {t('userBalance.toOriginalCurrencies1')}
                      &nbsp;
                      <Button
                        wrapperClassName="inline-block"
                        onClick={() => { setIsOriginalCurrencies(true) }}
                      >
                        <span className="text-blue">
                          {t('userBalance.toOriginalCurrencies2')}
                        </span>
                        .
                      </Button>
                    </div>
                    {isCalcInMyCurrency &&
                      <div>
                        {t('userBalance.toChangeYourCurrency')}
                        &nbsp;
                        <Button
                          wrapperClassName="inline-block"
                          onClick={() => { goSettings() }}
                        >
                          <span className="text-blue">
                            {t('userBalance.profileSettings')}
                          </span>
                          .
                        </Button>
                      </div>
                    }
                  </div>
                  <Button
                    className="text-[14px] leading-[24px] text-blue"
                    onClick={() => {
                      showPopup({
                        title: t('userBalance.calcHow'),
                        message: t('userBalance.how'),
                        buttons: [
                          {
                            id: 'ok',
                            text: t('ok'),
                            type: 'default',
                          },
                        ],
                      })
                    }}
                  >
                    {t('userBalance.calcHow')}
                  </Button>
                </div>
              </Panel>
            }

            {isTotal &&
              <Panel className="!pb-4">
                <div className="flex items-center -justify-between">
                  <h3 className="flex items-center">
                    {computedTotalValue.amount < 0 ? titleTotalDebts : titleTotalCredits}:
                  </h3>
                  &nbsp;
                  <CurrencyAmount
                    className="text-[16px] leading-[24px]"
                    currencyAmount={computedTotalValue}
                  />
                </div>
              </Panel>
            }

            {!!debtDetails.length &&
              <Panel key="Panel-debts" className="!mt-0">
                <h3 className="flex items-center">
                  <span>{titleDebts}</span>
                  &nbsp;
                  <CurrencyAmount
                    currencyAmount={computedDebtValue}
                  />
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  {debtDetails.map(debt => (
                    <Debt
                      key={JSON.stringify(debt)}
                      {...debt}
                      contextUserId={focusUserId || undefined}
                      onClick={() => {
                        setSelectedDebtId(JSON.stringify(debt))
                        feedback('settle_up_balances_web', {
                          user: userId || null,
                          user_from: debt.from_user_id,
                          user_to: debt.to_user_id,
                          amount: Math.abs(debt.value_primary.amount),
                          currency: debt.value_primary.currency_id,
                        })
                      }}
                    />
                  ))}
                </div>
              </Panel>
            }

            {!!creditDetails.length &&
              <Panel key="Panel-credits" className="!mt-0">
                <h3 className="flex items-center">
                  <span>{titleCredits}</span>
                  &nbsp;
                  <CurrencyAmount
                    currencyAmount={computedCreditValue}
                  />
                </h3>
                <div className="mt-4 flex flex-col gap-4">
                  {creditDetails.map(debt => (
                    <Debt
                      key={JSON.stringify(debt)}
                      {...debt}
                      contextUserId={focusUserId || undefined}
                      onClick={() => {
                        setSelectedDebtId(JSON.stringify(debt))
                        feedback('settle_up_balances_web', {
                          user: userId || null,
                          user_from: debt.from_user_id,
                          user_to: debt.to_user_id,
                          amount: Math.abs(debt.value_primary.amount),
                          currency: debt.value_primary.currency_id,
                        })
                      }}
                    />
                  ))}
                </div>
              </Panel>
            }

            {!!focusUserId &&
              <Panel className="!mt-0 !pb-4">
                <div className="flex flex-col gap-2">
                  <h3>{t('userBalance.rewriteOnMeTitle')}</h3>
                  <div className="text-[14px] leading-[20px] text-textSec2">
                    {t('userBalance.rewriteOnMeDescription')}
                  </div>
                  <Button
                    className="mt-2 w-full bg-blue py-2 rounded-md text-textButton text-[14px] leading-[20px] font-semibold"
                    onClick={handleRewriteOnMeClick}
                    disabled={!canRewriteOnMe}
                    isBusy={isBusy}
                  >
                    {t('userBalance.rewriteOnMeButton')}
                  </Button>
                </div>
              </Panel>
            }
          </div>

          {!!summaryCurrencyId &&
            <Button
              theme="bottom"
              onClick={() => { setIsCurrencyOpen(true) }}
            >
              {t('showInCurrency')}
            </Button>
          }
        </>
      )}

      {!selectedDebt && isItems === false && (
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
          </div>

          <Button
            theme="bottom"
            onClick={closeApp}
          >
            {t('close')}
          </Button>
        </>
      )}

      {!!selectedDebt && !isRecipientsOpen && (
        <>
          <h2 className="mb-2 px-4 pt-4 pb-[6px]">
            {`${t('settleUpBy')} ${selectedDebtCurrency?.symbol}`}
          </h2>

          <Panel>
            <DebtDetailed
              debt={selectedDebt}
              amount={selectedDebtAmount}
              setAmount={setSelectedDebtAmount}
              customRecipientId={customRecipientId}
              onClickRecipient={() => { setIsRecipientsOpen(true) }}
            />
          </Panel>

          <Button
            theme="bottom"
            onClick={settleUp}
            isBusy={isBusy}
          >
            {t('settleUp')}
          </Button>
        </>
      )}

      {!!selectedDebt && isRecipientsOpen && (
        <>
          <h2 className="mb-2 px-4 pt-4 pb-[6px]">{t('selectUser')}</h2>

          <div className="mt-4 overflow-y-auto">
            {users?.filter(user => user._id !== selectedDebt.from_user_id).map((user, i, arr) => (
              <>
                <UserButton
                  key={i}
                  user={user}
                  onClick={() => {
                    feedback('set_user_settleup_web', {
                      user_to_prev: selectedDebt.to_user_id,
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
