import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Header, Page, Panel, Category } from '../kit'

import { useStore, useInit } from '../hooks'

export const SelectCategory = () => {
  useInit()

  const [impactOccurred, , selectionChanged] = useHapticFeedback()
  const { t } = useTranslation()
  const { categories, transaction, setTransaction } = useStore()

  const [selectedCategory, setSelectedCategory] = useState<string>(transaction?.category || '')

  const apply = () => {
    if (transaction && selectedCategory) {
      setTransaction({
        ...transaction,
        category: selectedCategory,
      })
    }
    selectionChanged()
    impactOccurred('light')
    history.back()
  }

  return (
    <Page className="">
      <Header onBack={() => { history.back() }} />

      <Panel>
        <div className="flex flex-col gap-3">
          <h2 className="pt-[2px] pb-[6px]">{t('selectCategory')}</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(categories || {}).map(categoryKey => (
              <Category
                key={categoryKey}
                categoryKey={categoryKey}
                isActive={categoryKey === selectedCategory}
                onClick={() => { setSelectedCategory(categoryKey) }}
              />
            ))}
          </div>
        </div>
      </Panel>

      <Button
        isBottom
        text={t('apply')}
        onClick={apply}
      />
    </Page>
  )
}
