import cx from "classnames";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { TTransaction } from "../types";

import { Button, Divider } from "../kit";

import {
  useStore,
  useUsers,
  useCurrencies,
  useFeedback,
  useTransaction,
  useUser,
  useGetChat,
  useCategories,
} from "../hooks";

import { ReactComponent as ShareIcon } from "../assets/share.svg";

import entertainmentIcon from "../../ico_categories/entertainment.svg";
import financialExpensesIcon from "../../ico_categories/financial_expenses.svg";
import foodDrinksIcon from "../../ico_categories/food_drinks.svg";
import housingIcon from "../../ico_categories/housing.svg";
import incomeIcon from "../../ico_categories/income.svg";
import investmentsIcon from "../../ico_categories/investments.svg";
import otherIcon from "../../ico_categories/other.svg";
import paidIcon from "../../ico_categories/paid.svg";
import shoppingIcon from "../../ico_categories/shopping.svg";
import transportationIcon from "../../ico_categories/transportation.svg";
import utilitiesIcon from "../../ico_categories/utilities.svg";

import { formatAmount, getTransactionEditPath } from "../utils";

const CATEGORY_ICONS: Record<string, string> = {
  food_drinks: foodDrinksIcon,
  shopping: shoppingIcon,
  housing: housingIcon,
  transportation: transportationIcon,
  life_entertainment: entertainmentIcon,
  entertainment: entertainmentIcon,
  utilities: utilitiesIcon,
  financial_expenses: financialExpensesIcon,
  investments: investmentsIcon,
  income: incomeIcon,
  paid: paidIcon,
  other: otherIcon,
};

const DESCRIPTION_MAX_LENGTH = 36; // TODO: make it dynamic
const CANCELED_DESCRIPTION_MAX_LENGTH = 22; // TODO: make it dynamic

const shortenDescription = (
  description: string,
  maxLength = DESCRIPTION_MAX_LENGTH,
) => {
  const normalizedDescription = description.replace(/\s+/g, " ").trim();

  if (normalizedDescription.length <= maxLength) {
    return normalizedDescription;
  }

  return `${normalizedDescription.slice(0, maxLength).trimEnd()}...`;
};

const formatTxDateTime = (timeCreated: string, language: string) => {
  const date = new Date(timeCreated);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const txDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const dayDiff = Math.round((today - txDay) / (24 * 60 * 60 * 1000));
  const time = date.toLocaleTimeString(language, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (dayDiff === 0) {
    return `${time}, ${language === "ru" ? "сегодня" : "today"}`;
  }

  if (dayDiff === 1) {
    return `${time}, ${language === "ru" ? "вчера" : "yesterday"}`;
  }

  const isCurrentYear = now.getFullYear() === date.getFullYear();
  const day = date.toLocaleDateString(language, {
    day: "numeric",
    month: "short",
    ...(isCurrentYear ? {} : { year: "numeric" }),
  });

  return `${time}, ${day}`;
};

const TransactionCategoryIcon = ({
  tx,
  title,
  className,
}: {
  tx: TTransaction;
  title: string;
  className?: string;
}) => {
  const iconKey = tx.is_settleup ? "paid" : tx.category || "other";
  const icon = CATEGORY_ICONS[iconKey] || CATEGORY_ICONS.other;

  return (
    <img
      src={icon}
      alt=""
      className={cx("w-6 h-6 shrink-0", className)}
      title={title}
      draggable={false}
    />
  );
};

export const Transaction = ({
  tx,
  showPendingBalance = false,
}: {
  tx: TTransaction;
  showPendingBalance?: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { me } = useUser();
  const { data: chat } = useGetChat();

  const { setTxId, setIsEditTx } = useStore();
  const { getUserById } = useUsers();
  const { getCurrencyById } = useCurrencies();
  const { feedback } = useFeedback();
  const { getCategoryName } = useCategories();

  const { getMyBalanceDelta, getUserBalanceDelta } = useTransaction();
  const myBalanceDelta = getMyBalanceDelta(tx);

  const payerShares = tx.shares.filter((share) => share.is_payer);

  const payeeUserId = useMemo(() => {
    if (!me || !chat?.pay_for) return null;
    const payeeIdsRaw = (chat.pay_for as unknown as Record<string, unknown>)[
      String(me._id)
    ];
    if (!Array.isArray(payeeIdsRaw)) return null;
    const normalized = payeeIdsRaw
      .map((v) => (typeof v === "number" ? v : Number.parseInt(String(v), 10)))
      .filter((v) => Number.isFinite(v)) as number[];
    return normalized[0] ?? null;
  }, [chat?.pay_for, me]);

  const payee = payeeUserId ? getUserById(payeeUserId) : undefined;
  const payeeDisplayName = payee
    ? payee.shortened_name ||
      [payee.first_name, payee.last_name].filter(Boolean).join(" ")
    : null;

  const isTxConfirmedAndActive = !!tx.is_confirmed && !tx.is_canceled;
  const hasMyParticipation =
    !!me?._id && tx.shares.some((s) => s.related_user_id === me._id);
  const hasPayeeParticipation =
    !!payeeUserId && tx.shares.some((s) => s.related_user_id === payeeUserId);

  const payeeBalanceDelta = payeeUserId
    ? getUserBalanceDelta(tx, payeeUserId)
    : 0;

  // current behavior for payer: show only if non-zero
  const canShowBalanceDelta =
    isTxConfirmedAndActive ||
    tx.is_canceled ||
    (!!showPendingBalance && !tx.is_canceled);
  const isShowMyBalance =
    canShowBalanceDelta && hasMyParticipation && myBalanceDelta !== 0;
  // payee: always show signed delta when payee participates
  const isShowPayeeBalance =
    canShowBalanceDelta && hasPayeeParticipation && !!payeeDisplayName;

  const currency = getCurrencyById(tx.currency_id);
  const payerSharesAmount = payerShares.reduce((acc, _) => _.amount + acc, 0);

  const numberOfUsers: number = [
    ...new Set(
      tx.shares
        .filter((share) => share.related_user_id && share.amount)
        .map((share) => share.related_user_id),
    ),
  ].length;

  const title = tx.is_settleup
    ? t("transactionSettleUp")
    : tx.nutshell || t("transaction");
  const displayedTitle = shortenDescription(
    title,
    tx.is_canceled ? CANCELED_DESCRIPTION_MAX_LENGTH : DESCRIPTION_MAX_LENGTH,
  );
  const categoryTitle = tx.is_settleup
    ? t("transactionSettleUp")
    : getCategoryName(tx.category);
  const primaryPayerShare = payerShares[0];
  const primaryPayerUser = primaryPayerShare?.related_user_id
    ? getUserById(primaryPayerShare.related_user_id)
    : undefined;
  const primaryPayerName = primaryPayerUser
    ? primaryPayerUser.shortened_name ||
      [primaryPayerUser.first_name, primaryPayerUser.last_name]
        .filter(Boolean)
        .join(" ")
    : primaryPayerShare?.normalized_name || "???";

  const oweShares = tx.shares.filter((share) => !share.is_payer);
  const primaryOweShare = oweShares[0];
  const primaryOweUser = primaryOweShare?.related_user_id
    ? getUserById(primaryOweShare.related_user_id)
    : undefined;
  const primaryOweName = primaryOweUser
    ? primaryOweUser.shortened_name ||
      [primaryOweUser.first_name, primaryOweUser.last_name]
        .filter(Boolean)
        .join(" ")
    : primaryOweShare?.normalized_name || "???";

  const isShowOwnDelta = isShowMyBalance || isShowPayeeBalance;
  const ownDelta = isShowPayeeBalance ? payeeBalanceDelta : myBalanceDelta;
  const ownDeltaLabel = isShowPayeeBalance
    ? payeeDisplayName
    : ownDelta > 0
      ? t("owedToMe")
      : t("myBalance");
  const detailsClassName = cx(tx.is_canceled && "opacity-[.78]");
  const amountClassName = "text-textSec";
  const ownDeltaAmountClassName = tx.is_canceled
    ? "text-textSec"
    : ownDelta > 0
      ? "text-green"
      : "text-red";

  return (
    <Button
      wrapperClassName="Transaction"
      className="w-full min-w-0 overflow-hidden flex gap-2 rounded-[16px] text-left bg-bg2 pl-2 pr-3 py-2 touchscreen:enabled:hover:brightness-100 touchscreen:enabled:active:brightness-100"
      onClick={() => {
        setTxId(tx._id);
        setIsEditTx(true);
        navigate(getTransactionEditPath(tx._id));
        feedback("edit_transaction_total_web", {
          transaction_id: tx._id,
        });
        }}
      >
      <>
        <TransactionCategoryIcon tx={tx} title={categoryTitle} />
        <div className="min-w-0 flex-1 flex flex-col gap-[2px] text-[14px] leading-[24px]">
          <div>
            <div className="flex gap-[2px] items-start w-full">
              <div
                className="flex-1 min-w-0 first-letter:uppercase truncate font-semibold text-text"
                title={title}
              >
                {displayedTitle}
              </div>
              {tx.is_canceled && (
                <div className="h-5 shrink-0 rounded-[10px] bg-textSec px-[7px] text-[11px] leading-5 font-semibold text-bg">
                  {t("statusCanceled")}
                </div>
              )}
            </div>
            <div
              className={cx(
                "mt-[2px] flex items-start justify-between gap-2 text-textSec",
                detailsClassName,
              )}
            >
              <span className="min-w-0 truncate">
                {formatTxDateTime(tx.time_created, i18n.language)}
              </span>
              {!!numberOfUsers && (
                <div className="flex h-6 shrink-0 items-center overflow-hidden rounded-[16px] bg-separator pl-1 text-textSec2">
                  <ShareIcon className="h-4 w-4 shrink-0" />
                  <div className="pl-1 pr-[6px] text-[12px] leading-4 font-semibold">
                    {numberOfUsers}
                  </div>
                </div>
              )}
            </div>
            <Divider className={cx("!mx-0 !my-[4px]", detailsClassName)} />
            <div
              className={cx(
                "flex flex-col leading-[24px] whitespace-nowrap",
                detailsClassName,
              )}
            >
              {tx.is_settleup ? (
                <div className="flex min-w-0 w-full gap-2 items-center justify-between text-textSec">
                  <span
                    className="flex min-w-0 flex-1 items-center overflow-hidden"
                    title={`${primaryPayerName} → ${primaryOweName}`}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {primaryPayerName}
                    </span>
                    <span className="shrink-0 px-1 text-textSec2">→</span>
                    <span className="min-w-0 flex-1 truncate">
                      {primaryOweName}
                    </span>
                  </span>
                  <span
                    className={cx(
                      "shrink-0 font-semibold tracking-[0.084px]",
                      amountClassName,
                    )}
                  >
                    {formatAmount(payerSharesAmount)}
                    {currency?.symbol}
                  </span>
                </div>
              ) : (
                payerShares.map((payerShare) => {
                  const userId = payerShare.related_user_id;
                  const user = userId ? getUserById(userId) : undefined;
                  const isPayee = !!userId && userId === payeeUserId;

                  const payerTitle = user
                    ? isPayee && user.shortened_name
                      ? user.shortened_name
                      : [user.first_name, user.last_name]
                          .filter(Boolean)
                          .join(" ")
                    : payerShare.normalized_name || "???";

                  return (
                    <div
                      key={`payer-share-${payerShare.person_id}-${String(payerShare.related_user_id)}-${payerShare.amount}`}
                      className="flex gap-2 items-center justify-between text-textSec"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {t("paidBy", { name: payerTitle })}
                      </span>
                      <span
                        className={cx(
                          "shrink-0 font-semibold tracking-[0.084px]",
                          amountClassName,
                        )}
                      >
                        {formatAmount(payerShare.amount)}
                        {currency?.symbol}
                      </span>
                    </div>
                  );
                })
              )}
              {isShowOwnDelta && (
                <div className="flex h-6 gap-2 items-center justify-between rounded-[4px] py-[2px] font-semibold">
                  <span className="shrink-0 truncate text-textSec">
                    {ownDeltaLabel}
                  </span>
                  <span
                    className={cx(
                      "min-w-0 flex-1 truncate text-right",
                      ownDeltaAmountClassName,
                    )}
                  >
                    {formatAmount(Math.abs(ownDelta))}
                    {currency?.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>
          {!tx.is_confirmed && !tx.is_canceled && (
            <div className="flex justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-x-2 gap-y-1 pt-[2px] --empty:hidden">
                <div className="rounded-[8px] px-1 py-[2px] bg-separator text-[12px] leading-[16px] font-semibold text-yellow">
                  {t("statusUnconfirmed")}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </Button>
  );
};
