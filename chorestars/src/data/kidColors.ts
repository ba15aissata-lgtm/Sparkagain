export const KID_COLOR_IDS = [
  'violet',
  'sky',
  'emerald',
  'amber',
  'pink',
  'orange',
  'rose',
  'teal',
] as const

export type KidColorId = (typeof KID_COLOR_IDS)[number]

interface KidColorStyle {
  bg: string
  bgSoft: string
  text: string
  border: string
  ring: string
}

// Tailwind v4 scans source for literal class names — keep these spelled out.
export const KID_COLOR_STYLES: Record<KidColorId, KidColorStyle> = {
  violet: {
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-500/10',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-500/30',
    ring: 'ring-violet-500',
  },
  sky: {
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-500/10',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
    ring: 'ring-sky-500',
  },
  emerald: {
    bg: 'bg-emerald-500',
    bgSoft: 'bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500',
  },
  amber: {
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500',
  },
  pink: {
    bg: 'bg-pink-500',
    bgSoft: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-500/30',
    ring: 'ring-pink-500',
  },
  orange: {
    bg: 'bg-orange-500',
    bgSoft: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500',
  },
  rose: {
    bg: 'bg-rose-500',
    bgSoft: 'bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    ring: 'ring-rose-500',
  },
  teal: {
    bg: 'bg-teal-500',
    bgSoft: 'bg-teal-500/10',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30',
    ring: 'ring-teal-500',
  },
}

export const KID_EMOJI_OPTIONS = [
  '🧒', '👦', '👧', '🦸', '🦸‍♀️', '🦄', '🐯', '🐱', '🐶', '⚽', '🎨', '🚀',
  '👩', '👨', '🧑', '👩‍🍳', '🧑‍🍳', '😎',
]
