import 'server-only'
import type { Locale } from '@/i18n.config'

const dictionaries = {
  en: () => import('@/translations/en').then(module => module.default),
  ar: () => import('@/translations/ar').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}