import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Challenge, ChallengeProgress, DayLog, Rule } from '../types'
import { SEED_CHALLENGE } from '../data/seed'
import { todayISO } from '../lib/date'

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function emptyProgress(ruleCount: number): ChallengeProgress {
  return {
    currentDay: 1,
    bestStreak: 0,
    vaultTotal: 0,
    restartCount: 0,
    todayChecks: new Array(ruleCount).fill(false),
    lastCheckedDate: null,
  }
}

export interface NewChallengeInput {
  name: string
  totalDays: number
  currency: string
  penaltyMin: number
  penaltyMax: number
  penaltyStep: number
  rules: string[]
}

interface State {
  challenges: Challenge[]
  dayLogs: DayLog[]
  progress: Record<string, ChallengeProgress>

  addChallenge: (input: NewChallengeInput) => void
  updateChallenge: (id: string, patch: Partial<Challenge>) => void
  archiveChallenge: (id: string) => void
  deleteChallenge: (id: string) => void

  toggleRuleCheck: (challengeId: string, ruleIndex: number) => void
  validateDay: (challengeId: string) => void
  declareFail: (challengeId: string, amount: number, reason: string) => void
  resetChallengeProgress: (challengeId: string) => void
}

function freshTodayChecks(progress: ChallengeProgress, ruleCount: number): boolean[] {
  if (progress.lastCheckedDate === todayISO() && progress.todayChecks.length === ruleCount) {
    return progress.todayChecks
  }
  return new Array(ruleCount).fill(false)
}

const seedId = uid()
const seedChallenge: Challenge = {
  id: seedId,
  name: SEED_CHALLENGE.name,
  totalDays: SEED_CHALLENGE.totalDays,
  currency: SEED_CHALLENGE.currency,
  penaltyMin: SEED_CHALLENGE.penaltyMin,
  penaltyMax: SEED_CHALLENGE.penaltyMax,
  penaltyStep: SEED_CHALLENGE.penaltyStep,
  rules: SEED_CHALLENGE.rules.map((text) => ({ id: uid(), text })),
  archived: false,
  createdAt: todayISO(),
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      challenges: [seedChallenge],
      dayLogs: [],
      progress: { [seedId]: emptyProgress(seedChallenge.rules.length) },

      addChallenge: (input) =>
        set((s) => {
          const rules: Rule[] = input.rules
            .map((t) => t.trim())
            .filter(Boolean)
            .map((text) => ({ id: uid(), text }))
          const challenge: Challenge = {
            id: uid(),
            name: input.name,
            totalDays: input.totalDays,
            currency: input.currency,
            penaltyMin: input.penaltyMin,
            penaltyMax: input.penaltyMax,
            penaltyStep: input.penaltyStep,
            rules,
            archived: false,
            createdAt: todayISO(),
          }
          return {
            challenges: [...s.challenges, challenge],
            progress: { ...s.progress, [challenge.id]: emptyProgress(rules.length) },
          }
        }),

      updateChallenge: (id, patch) =>
        set((s) => ({
          challenges: s.challenges.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      archiveChallenge: (id) =>
        set((s) => ({
          challenges: s.challenges.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)),
        })),

      deleteChallenge: (id) =>
        set((s) => {
          const progress = { ...s.progress }
          delete progress[id]
          return {
            challenges: s.challenges.filter((c) => c.id !== id),
            dayLogs: s.dayLogs.filter((l) => l.challengeId !== id),
            progress,
          }
        }),

      toggleRuleCheck: (challengeId, ruleIndex) =>
        set((s) => {
          const challenge = s.challenges.find((c) => c.id === challengeId)
          const prog = s.progress[challengeId]
          if (!challenge || !prog) return s
          const checks = [...freshTodayChecks(prog, challenge.rules.length)]
          checks[ruleIndex] = !checks[ruleIndex]
          return {
            progress: {
              ...s.progress,
              [challengeId]: { ...prog, todayChecks: checks, lastCheckedDate: todayISO() },
            },
          }
        }),

      validateDay: (challengeId) =>
        set((s) => {
          const challenge = s.challenges.find((c) => c.id === challengeId)
          const prog = s.progress[challengeId]
          if (!challenge || !prog) return s
          const checks = freshTodayChecks(prog, challenge.rules.length)
          if (checks.length === 0 || !checks.every(Boolean)) return s

          const log: DayLog = {
            id: uid(),
            challengeId,
            date: todayISO(),
            day: prog.currentDay,
            success: true,
            checks,
            createdAt: new Date().toISOString(),
          }
          const nextDay = prog.currentDay + 1
          return {
            dayLogs: [log, ...s.dayLogs],
            progress: {
              ...s.progress,
              [challengeId]: {
                ...prog,
                currentDay: nextDay,
                bestStreak: Math.max(prog.bestStreak, nextDay - 1),
                todayChecks: new Array(challenge.rules.length).fill(false),
                lastCheckedDate: null,
              },
            },
          }
        }),

      declareFail: (challengeId, amount, reason) =>
        set((s) => {
          const challenge = s.challenges.find((c) => c.id === challengeId)
          const prog = s.progress[challengeId]
          if (!challenge || !prog) return s

          const log: DayLog = {
            id: uid(),
            challengeId,
            date: todayISO(),
            day: prog.currentDay,
            success: false,
            checks: freshTodayChecks(prog, challenge.rules.length),
            amount,
            reason: reason.trim() || undefined,
            createdAt: new Date().toISOString(),
          }
          return {
            dayLogs: [log, ...s.dayLogs],
            progress: {
              ...s.progress,
              [challengeId]: {
                ...prog,
                currentDay: 1,
                vaultTotal: prog.vaultTotal + amount,
                restartCount: prog.restartCount + 1,
                todayChecks: new Array(challenge.rules.length).fill(false),
                lastCheckedDate: null,
              },
            },
          }
        }),

      resetChallengeProgress: (challengeId) =>
        set((s) => {
          const challenge = s.challenges.find((c) => c.id === challengeId)
          if (!challenge) return s
          return {
            dayLogs: s.dayLogs.filter((l) => l.challengeId !== challengeId),
            progress: { ...s.progress, [challengeId]: emptyProgress(challenge.rules.length) },
          }
        }),
    }),
    { name: 'defis-storage' }
  )
)

export { freshTodayChecks }
