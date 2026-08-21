import type { ChoreCategory } from '../types'

export interface CategoryInfo {
  id: ChoreCategory
  label: string
  emoji: string
}

export const CHORE_CATEGORIES: CategoryInfo[] = [
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'dogs', label: 'Dog Care', emoji: '🐶' },
  { id: 'other', label: 'Other', emoji: '📋' },
]

interface CategoryStyle {
  bg: string
  bgSoft: string
  text: string
  border: string
  dot: string
}

// Tailwind v4 scans source for literal class names, so these must be
// written out in full (no template interpolation) to survive purging.
export const CATEGORY_STYLES: Record<ChoreCategory, CategoryStyle> = {
  cooking: {
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  cleaning: {
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500',
  },
  dogs: {
    bg: 'bg-emerald-500',
    bgSoft: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  other: {
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    dot: 'bg-violet-500',
  },
}
