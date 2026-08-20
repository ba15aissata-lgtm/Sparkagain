import type { CategoryId } from '../types'

interface CategoryStyle {
  bg: string
  bgSoft: string
  text: string
  border: string
  ring: string
  dot: string
}

// Tailwind v4 scans source for literal class names, so these must be
// written out in full (no template interpolation) to survive purging.
export const CATEGORY_STYLES: Record<CategoryId, CategoryStyle> = {
  discipline: {
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    ring: 'ring-violet-500',
    dot: 'bg-violet-500',
  },
  sports: {
    bg: 'bg-emerald-500',
    bgSoft: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500',
    dot: 'bg-emerald-500',
  },
  diet: {
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500',
    dot: 'bg-amber-500',
  },
  hygiene: {
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
    ring: 'ring-sky-500',
    dot: 'bg-sky-500',
  },
  selfcare: {
    bg: 'bg-pink-500',
    bgSoft: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/30',
    ring: 'ring-pink-500',
    dot: 'bg-pink-500',
  },
  outfit: {
    bg: 'bg-orange-500',
    bgSoft: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500',
    dot: 'bg-orange-500',
  },
}
