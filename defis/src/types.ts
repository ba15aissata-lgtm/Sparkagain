export interface Rule {
  id: string
  // Plain text; wrap a phrase in **double asterisks** to render it bold.
  text: string
}

export interface Challenge {
  id: string
  name: string
  totalDays: number
  rules: Rule[]
  currency: string
  penaltyMin: number
  penaltyMax: number
  penaltyStep: number
  archived: boolean
  createdAt: string
}

export interface DayLog {
  id: string
  challengeId: string
  date: string // ISO date
  day: number
  success: boolean
  checks: boolean[]
  amount?: number
  reason?: string
  createdAt: string
}

export interface ChallengeProgress {
  currentDay: number
  bestStreak: number
  vaultTotal: number
  restartCount: number
  todayChecks: boolean[]
  lastCheckedDate: string | null
}
