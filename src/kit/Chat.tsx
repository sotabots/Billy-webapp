import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { useCurrencies } from '../hooks'
import { Avatar, VoiceLimit, Button } from '../kit'
import { TUserChat } from '../types'
import { formatAmount } from '../utils'

export const Chat =({ chat, onClick }: {
  chat: TUserChat
  onClick: () => void
}) => {
  const { t } = useTranslation()
  const { getCurrencyById } = useCurrencies()

  const chatCurrency = getCurrencyById(chat.user_balance.in_chat_currency.currency_id || 'USD')
  const chatCurrencySymbol = chatCurrency?.symbol || '$'

  const userCurrency = getCurrencyById(chat.user_balance.in_user_currency.currency_id || 'USD')
  const userCurrencySymbol = userCurrency?.symbol || '$'

  return (
    <Button
      className={cx('Chat w-full flex items-center justify-between gap-4')}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 truncate">
        <Avatar chat={chat} size={60} />
        <div className="truncate">
          <div className="text-[16px] leading-[24px] font-semibold truncate">{chat.name}</div>
          {chat.voice_limit >= 0 &&
            <VoiceLimit limit={chat.voice_limit} theme="gray" />
          }
        </div>
      </div>
      <div className="text-right">
        {chat.is_settled_up &&
          <div className="text-[16px] leading-[24px] text-textSec2">{t('profile.settledUp')}</div>
        }
        {!chat.is_settled_up &&
          <>
            <div className={cx(
              'text-[16px] leading-[24px] font-semibold',
              chat.user_balance.in_chat_currency.amount > 0 && 'text-green',
              chat.user_balance.in_chat_currency.amount < 0 && 'text-red',
            )}>
              {chat.user_balance.in_chat_currency.amount > 0 ? '+' : ''}{formatAmount(chat.user_balance.in_chat_currency.amount)}&nbsp;{chatCurrencySymbol}
            </div>
            {chatCurrency?._id !== userCurrency?._id &&
              <div className="text-[14px] leading-[24px] text-textSec2">
                {chat.user_balance.in_user_currency.amount > 0 ? '+' : ''}{formatAmount(chat.user_balance.in_user_currency.amount)}&nbsp;{userCurrencySymbol}
              </div>
            }
          </>
        }
      </div>
    </Button>
  )
}
