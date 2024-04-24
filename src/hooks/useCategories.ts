import { useTranslation } from 'react-i18next'

import { useStore } from '../store'

export const useCategories = () => {
  const { t, i18n } = useTranslation()
  const { categories } = useStore()

  const getCategory = (categoryKey: string | null) => {
    return categories?.[categoryKey || ''] || null
  }

  const getCategoryColor = (categoryKey: string | null, aplha = 1) => {
    const category = getCategory(categoryKey)
    const hue = category ? category.hue : 0
    const saturation = category ? '80%' : '0%'
    const lightness = category ? '85%' : '90%'
    return `hsla(${hue}, ${saturation}, ${lightness}, ${aplha})`
  }

  const getCategoryEmoji = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return category?.emoji || '❔'
  }

  const getCategoryName = (categoryKey: string | null) => {
    const category = getCategory(categoryKey)
    return (typeof category?.name === 'object'
      ? (
        Object.keys(category.name).includes(i18n.language)
        ? category.name[i18n.language as 'en' | 'ru']
        : category.name.en
      )
      : (category?.name) || t('categoryUnknown'))
  }

  return { getCategory, getCategoryColor, getCategoryEmoji, getCategoryName }
}
