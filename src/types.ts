export type CategoryId =
  | 'discipline'
  | 'sports'
  | 'diet'
  | 'hygiene'
  | 'selfcare'
  | 'outfit'

export interface Category {
  id: CategoryId
  label: string
  color: string // tailwind color name base, e.g. 'violet'
  emoji: string
}

export interface Habit {
  id: string
  name: string
  category: CategoryId
  createdAt: string // ISO date
  archived: boolean
  targetDaysPerWeek: number // 1-7, for weekly-goal habits
}

// completions[habitId][dateISO] = true
export type Completions = Record<string, Record<string, boolean>>

export interface OutfitEntry {
  id: string
  date: string // ISO date (yyyy-mm-dd)
  description: string
  tags: string[]
  rating: number // 1-5
  photoDataUrl?: string
  createdAt: string
}
