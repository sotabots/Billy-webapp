import cx from 'classnames'

import { useCategories } from '../hooks'
import { TNewTransaction, TTransaction } from '../types'

const CategoryAvatar = ({ tx, isCategoryName = true }: { tx: TTransaction | TNewTransaction, isCategoryName?: boolean }) => {
  const { getCategoryColor, getCategoryEmoji, getCategoryName } = useCategories()

  const backgroundColor = getCategoryColor(tx.category)
  const emoji = getCategoryEmoji(tx.category)

  const categoryName = getCategoryName(tx.category)

  return (
    <div
      className={cx(
        'CategoryAvatar flex items-center gap-1 h-6 select-none',
        !isCategoryName && 'cursor-help',
      )}
      title={!isCategoryName ? categoryName : undefined}
    >
      <div
        className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden text-[16px] leading-6"
        style={{ backgroundColor }}
      >
        {emoji}
      </div>
      {!!isCategoryName && (
        <span className="text-[14px] leading-5">{categoryName}</span>
      )}
    </div>
)}

export default CategoryAvatar
