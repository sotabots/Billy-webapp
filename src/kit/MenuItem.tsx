import { ReactComponent as SettingsGoIcon } from '../assets/settings-go.svg'

import Button from './Button'
import Toggle from './Toggle'

const MenuItem = ({ icon, title, value, isEnabled, onClick }: {
  icon: any
  title: string
  value?: string
  isEnabled?: boolean
  onClick: VoidFunction
}) => {
  return (
    <Button
      theme="clear"
      className="flex items-center justify-between gap-4 w-full min-h-[44px] bg-bg px-4 py-2"
      onClick={onClick}
      text={
        <>
          <div className="flex items-center gap-2">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
          {value &&
            <div className="flex items-center gap-1">
              <span className="opacity-50">{value}</span>
              <span className="opacity-30"><SettingsGoIcon /></span>
            </div>
          }
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

export default MenuItem
