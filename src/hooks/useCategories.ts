import { useStore } from '../store'

export const useCategories = () => {
  const { categories } = useStore()

  const getCategory = (categoryKey: string | null) => {
    return categories?.[categoryKey || ''] || null
  }

  const getCategoryColor = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return category?.hue ? `hsla(${category.hue}, 100%, 74%, 1)` : '#8884'
  }

  const getCategoryEmoji = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return category?.emoji || ' '
  }

  return { getCategory, getCategoryColor, getCategoryEmoji }
}
