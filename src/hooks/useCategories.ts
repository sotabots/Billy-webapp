import { useTranslation } from 'react-i18next'

import { useGetCategories } from '../hooks'

export const useCategories = () => {
  const { t, i18n } = useTranslation()
  const { data: categories } = useGetCategories()

  const getCategory = (categoryKey: string | null) => {
    return categories?.[categoryKey || ''] || null
  }

  const getCategoryColor = (categoryKey: string | null, aplha = 1) => {
    const category = getCategory(categoryKey)
    const hue = category ? category.hue : 0
    const saturation = category ? '75%' : '0%'
    const lightness = category ? '75%' : '75%'
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
      : (category?.name) || t('noCategory'))
  }

  return { getCategory, getCategoryColor, getCategoryEmoji, getCategoryName }
}
