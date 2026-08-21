export type ChoreCategory = 'cooking' | 'cleaning' | 'dogs' | 'other'

export interface Kid {
  id: string
  name: string
  age: number | null
  emoji: string
  color: string
  archived: boolean
  createdAt: string
}

export interface Chore {
  id: string
  name: string
  category: ChoreCategory
  points: number
  kidIds: string[]
  frequency: 'daily' | 'weekly'
  weekdays: number[] // 0=Mon..6=Sun, used when frequency === 'weekly'
  archived: boolean
  createdAt: string
}

// completions[choreId][kidId][dateISO] = true
export type Completions = Record<string, Record<string, Record<string, boolean>>>

// A snapshotted record of points a kid earned, independent of the chore's
// current point value so editing/deleting a chore never rewrites history.
export interface PointEntry {
  id: string
  kidId: string
  choreId: string
  choreName: string
  points: number
  date: string // ISO date
  createdAt: string
}

export interface Reward {
  id: string
  name: string
  emoji: string
  cost: number
  archived: boolean
  createdAt: string
}

export interface Redemption {
  id: string
  kidId: string
  rewardId: string
  rewardName: string
  rewardEmoji: string
  cost: number
  date: string // ISO date
  createdAt: string
}
