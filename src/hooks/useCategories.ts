import { useStore } from '../store'

export const useCategories = () => {
  const { categories } = useStore()

  const getCategory = (categoryKey: string | null) => {
    return categories?.[categoryKey || ''] || null
  }

  const getCategoryColor = (categoryKey: string | null, aplha = 1) => {
    const category = getCategory(categoryKey)
    const hue = category ? category.hue : 0
    const saturation = category ? '100%' : '0%'
    const lightness = '66%'
    return `hsla(${hue}, ${saturation}, ${lightness}, ${aplha})`
  }

  const getCategoryEmoji = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return category?.emoji || ' '
  }

  const getCategoryName = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return (typeof category?.name === 'object' ? category?.name.en : category?.name) || 'Unknown' // todo: improve i18n
  }

  return { getCategory, getCategoryColor, getCategoryEmoji, getCategoryName }
}
