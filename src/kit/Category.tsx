import { useCategories } from '../hooks'

const Category = ({ categoryKey, amountFormatted }: { categoryKey: string, amountFormatted?: string }) => {
  const { getCategoryColor, getCategoryEmoji, getCategoryName } = useCategories()

  const borderColor = getCategoryColor(categoryKey, .420)
  const color = getCategoryColor(categoryKey, 1)
  const categoryEmoji = getCategoryEmoji(categoryKey)
  const categoryName = getCategoryName(categoryKey)

  return (
    <div
      className="Category flex gap-2 px-2 border rounded-[6px] text-[14px] leading-[24px] tracking-[-0.084em]"
      style={{ borderColor, color }}
    >
      <span className="flex items-center justify-center">{categoryEmoji}</span>
      <span className="">{categoryName}</span>
      {!!amountFormatted && (
        <span className="font-semibold">{amountFormatted}</span>
      )}
    </div>
)}

export default Category
