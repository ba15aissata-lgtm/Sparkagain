import type { ChoreCategory } from '../types'

export const SEED_KIDS = [
  { name: 'Kid 1', age: 12, emoji: '🧒', color: 'violet' },
  { name: 'Kid 2', age: 9, emoji: '👦', color: 'sky' },
]

export const SEED_CHORES: {
  name: string
  category: ChoreCategory
  points: number
  frequency: 'daily' | 'weekly'
  weekdays: number[]
}[] = [
  { name: 'Make your bed', category: 'cleaning', points: 5, frequency: 'daily', weekdays: [] },
  { name: 'Tidy your room', category: 'cleaning', points: 5, frequency: 'daily', weekdays: [] },
  { name: 'Take out the trash', category: 'cleaning', points: 10, frequency: 'weekly', weekdays: [1, 4] },
  { name: 'Vacuum the living room', category: 'cleaning', points: 15, frequency: 'weekly', weekdays: [5] },
  { name: 'Set the table', category: 'cooking', points: 5, frequency: 'daily', weekdays: [] },
  { name: 'Help make dinner', category: 'cooking', points: 10, frequency: 'weekly', weekdays: [0, 2, 4] },
  { name: 'Pack school lunch', category: 'cooking', points: 5, frequency: 'daily', weekdays: [] },
  { name: 'Feed the dog', category: 'dogs', points: 5, frequency: 'daily', weekdays: [] },
  { name: 'Walk the dog', category: 'dogs', points: 10, frequency: 'daily', weekdays: [] },
  { name: 'Clean up the yard', category: 'dogs', points: 10, frequency: 'weekly', weekdays: [6] },
  { name: 'Homework done', category: 'other', points: 10, frequency: 'daily', weekdays: [] },
  { name: 'Read for 20 minutes', category: 'other', points: 5, frequency: 'daily', weekdays: [] },
]

export const SEED_REWARDS = [
  { name: '30 min extra screen time', emoji: '🎮', cost: 20 },
  { name: 'Pick the movie', emoji: '🎬', cost: 15 },
  { name: 'Stay up 30 min later', emoji: '🌙', cost: 25 },
  { name: 'Choose what\'s for dinner', emoji: '🍕', cost: 30 },
  { name: 'Skip one chore', emoji: '🎟️', cost: 40 },
  { name: '$5 allowance', emoji: '💵', cost: 50 },
]
