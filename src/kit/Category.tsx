import { useCategories } from '../hooks'

import { Button } from '../kit'

export const Category = ({ categoryKey, amountFormatted, isActive, onClick }: {
  categoryKey: string,
  amountFormatted?: string,
  isActive?: boolean,
  onClick?: VoidFunction
}) => {
  const { getCategoryColor, getCategoryEmoji, getCategoryName } = useCategories()

  const borderColor = getCategoryColor(categoryKey, .420)
  const color = getCategoryColor(categoryKey, 1)
  const categoryEmoji = getCategoryEmoji(categoryKey)
  const categoryName = getCategoryName(categoryKey)

  const style = {
    borderColor: isActive ? color : borderColor,
    color: isActive ? 'white' : color,
    backgroundColor: isActive ? color : 'transparent'
  }

  const className = 'Category flex gap-1 px-1 border rounded-full text-[13px] leading-[20px] tracking-[-0.084em] transition-all'

  const inner = (
    <>
      <span className="flex items-center justify-center">{categoryEmoji}</span>
      <span className="">{categoryName}</span>
      {!!amountFormatted && (
        <span className="font-semibold">{amountFormatted}</span>
      )}
    </>
  )

  return (
    onClick ? (
      <Button
        onClick={onClick}
      >
        <div className={className} style={style}>{inner}</div>
      </Button>
    ) : (
      <div
        className={className}
        style={style}
      >
        {inner}
      </div>
    )
  )
}
