import type { Category, CategoryId } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'discipline', label: 'Discipline', color: 'violet', emoji: '🎯' },
  { id: 'sports', label: 'Sports', color: 'emerald', emoji: '🏃' },
  { id: 'diet', label: 'Diet', color: 'amber', emoji: '🥗' },
  { id: 'hygiene', label: 'Hygiene', color: 'sky', emoji: '🧼' },
  { id: 'selfcare', label: 'Self Care', color: 'pink', emoji: '💆' },
  { id: 'outfit', label: 'Outfit of the Day', color: 'orange', emoji: '👗' },
]

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<CategoryId, Category>
)

export const DEFAULT_HABITS: { name: string; category: CategoryId; targetDaysPerWeek: number }[] = [
  { name: 'Wake up before 7am', category: 'discipline', targetDaysPerWeek: 7 },
  { name: 'Make the bed', category: 'discipline', targetDaysPerWeek: 7 },
  { name: 'No phone first 30 min', category: 'discipline', targetDaysPerWeek: 7 },
  { name: 'Workout / training session', category: 'sports', targetDaysPerWeek: 5 },
  { name: '10k steps', category: 'sports', targetDaysPerWeek: 6 },
  { name: 'Stretch / mobility', category: 'sports', targetDaysPerWeek: 7 },
  { name: 'Drink 2L water', category: 'diet', targetDaysPerWeek: 7 },
  { name: 'Eat 3 balanced meals', category: 'diet', targetDaysPerWeek: 7 },
  { name: 'No junk food', category: 'diet', targetDaysPerWeek: 5 },
  { name: 'Brush teeth (AM & PM)', category: 'hygiene', targetDaysPerWeek: 7 },
  { name: 'Shower', category: 'hygiene', targetDaysPerWeek: 7 },
  { name: 'Skincare routine', category: 'hygiene', targetDaysPerWeek: 7 },
  { name: 'Journal / reflect', category: 'selfcare', targetDaysPerWeek: 5 },
  { name: '10 min meditation', category: 'selfcare', targetDaysPerWeek: 5 },
  { name: 'Plan tomorrow\'s outfit', category: 'outfit', targetDaysPerWeek: 7 },
]
