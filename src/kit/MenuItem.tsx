import { ReactComponent as SettingsGoIcon } from '../assets/settings-go.svg'

const MenuItem = ({ icon, title, value, onClick }: {
  icon: any
  title: string
  value: string
  onClick: VoidFunction
}) => {
  return (
    <button
      className="MenuItem flex items-center justify-between gap-4 w-full min-h-[44px] bg-bg px-4 py-2"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="opacity-50">{value}</span>
        <span className="opacity-30"><SettingsGoIcon /></span>
      </div>
    </button>
  )
}

export default MenuItem
