import cx from 'classnames'
import { useState } from 'react'
import Lottie from 'lottie-react'
import { useTranslation } from 'react-i18next'

import { useGetUsers } from '../hooks'
import { Panel, Divider, UserButton, Button, CurrencyAmount } from '../kit'
import { TUser } from '../types'

import { ReactComponent as SortIcon } from '../assets/sort.svg'
import lottieKoalaSettledUp from '../assets/animation-koala-settled-up.json'

export const ChatBalance = () => {
  const { t } = useTranslation()

  const [isAsc, setIsAsc] = useState(true)
  const { data: users /*, isLoading */ } = useGetUsers()

  const nonzeroUsers: undefined | TUser[] = users?.filter(user => !!user.balance.amount).sort((a, b) => ((a.balance.amount < b.balance.amount === isAsc) ? -1 : 1))

  return (
    <Panel>
        {nonzeroUsers?.length === 0 &&
          <div className="w-[244px] mx-auto flex flex-col gap-6 py-8 text-center">
            <div className="mx-auto w-[215px] h-[200px]">
              <Lottie
                style={{ width: 215, height: 200 }}
                animationData={lottieKoalaSettledUp}
                loop={true}
              />
            </div>
            <div className="text-[24px] leading-[32px] font-semibold">
              {t('chatBalance.allSettledUp')}
            </div>
          </div>
        }
        {!!nonzeroUsers && nonzeroUsers?.length > 0 &&
          <>
            <Button
              className=""
              onClick={() => { setIsAsc(!isAsc) }}
            >
              <div className="flex items-center gap-1 text-blue">
                <div className="text-[14px] leading-[24px] font-semibold">
                  {t(isAsc ? 'chatBalance.sortAsc' : 'chatBalance.sortDesc')}
                </div>
                <SortIcon className={cx('w-6 h-6 transition-all', !isAsc && 'scale-x-[-1]')} />
              </div>
            </Button>
            <div className="mt-3 -mx-4 overflow-y-auto">
              {nonzeroUsers.map((user, i, arr) => (
                <>
                  <UserButton
                    key={i}
                    user={user}
                    right={
                      <CurrencyAmount
                        className="text-[14px] leading-[24px]"
                        currencyAmount={user.balance}
                      />
                    }
                    // isChevron
                    onClick={() => {
                      /* */
                    }}
                  />
                  {i < arr.length - 1 && <Divider key={`Divider-${i}`} />}
                </>
              ))}
            </div>
          </>
        }
    </Panel>
  )
}
