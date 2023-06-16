import cx from 'classnames'

type TRadioButton = {
  group: string,
  label: string,
  value: string,
  checked: boolean,
  onChange: (value: string) => void
}

function RadioButton({ group, label, value, checked, onChange }: TRadioButton) {
  return (
    <label
      className={cx(
        'w-full flex gap-2 items-center px-4 py-2 cursor-pointer select-none',
      )}
      htmlFor={`${group}-${value}`}
      onClick={() => onChange(value)}
    >
      <input
        className="hidden"
        id={`${group}-${value}`}
        name={group}
        value={value}
        checked={checked}
      />
      <div className="p-1.5">
        <div
          className={cx(
            'flex items-center justify-center w-5 h-5 border-2 rounded-full text-hint',
            checked && '!text-link'
          )}
        >
          <div className={cx('w-[10px] h-[10px] rounded-full bg-link opacity-0 transition-all', checked && '!opacity-100')} />
        </div>
      </div>
      <div className="flex-1">{label}</div>
    </label>
  )
}

export default RadioButton
