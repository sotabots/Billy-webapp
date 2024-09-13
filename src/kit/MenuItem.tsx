import { ReactNode } from 'react'

import { ReactComponent as SettingsGoIcon } from '../assets/settings-go.svg'

import { Button, Toggle } from '../kit'

export const MenuItem = ({ icon, title, value, badge, isEnabled, disabled, onClick }: {
  icon: any
  title: string
  value?: string
  badge?: ReactNode
  isEnabled?: boolean
  disabled?: boolean
  onClick: VoidFunction
}) => {
  return (
    <Button
      theme="clear"
      className="flex items-center justify-between gap-2 w-full min-h-[44px] px-4 py-2"
      disabled={disabled}
      onClick={onClick}
      text={
        <>
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span className="text-left leading-[1em]">{title}</span>
          </div>
          {value && !badge &&
            <div className="flex items-center gap-1">
              <span className="opacity-50">{value}</span>
              <span className="opacity-30"><SettingsGoIcon /></span>
            </div>
          }
          {badge}
          {isEnabled !== undefined &&
            <Toggle
              size="big"
              value={isEnabled}
            />
          }
        </>
      }
    />
  )
}
