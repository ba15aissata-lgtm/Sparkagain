import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Completions, Habit, OutfitEntry, CategoryId, ReminderSettings } from '../types'
import { DEFAULT_HABITS } from '../data/categories'
import { addDays, todayISO, weekDates } from '../lib/date'

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

interface State {
  habits: Habit[]
  completions: Completions
  outfits: OutfitEntry[]
  reminders: ReminderSettings
  reminderLastFired: Record<string, string>

  addHabit: (name: string, category: CategoryId, targetDaysPerWeek?: number) => void
  updateHabit: (id: string, patch: Partial<Habit>) => void
  archiveHabit: (id: string) => void
  deleteHabit: (id: string) => void

  toggleCompletion: (habitId: string, dateISO: string) => void
  isCompleted: (habitId: string, dateISO: string) => boolean

  addOutfit: (entry: Omit<OutfitEntry, 'id' | 'createdAt'>) => void
  deleteOutfit: (id: string) => void

  currentStreak: (habitId: string) => number
  bestStreak: (habitId: string) => number
  weeklyCompleted: (habitId: string, dateISO?: string) => number

  setRemindersEnabled: (enabled: boolean) => void
  addReminderTime: (time: string) => void
  removeReminderTime: (time: string) => void
  markReminderFired: (time: string, dateISO: string) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      habits: DEFAULT_HABITS.map((h) => ({
        id: uid(),
        name: h.name,
        category: h.category,
        createdAt: todayISO(),
        archived: false,
        targetDaysPerWeek: h.targetDaysPerWeek,
      })),
      completions: {},
      outfits: [],
      reminders: { enabled: false, times: ['09:00', '20:00'] },
      reminderLastFired: {},

      addHabit: (name, category, targetDaysPerWeek = 7) =>
        set((s) => ({
          habits: [
            ...s.habits,
            {
              id: uid(),
              name,
              category,
              createdAt: todayISO(),
              archived: false,
              targetDaysPerWeek,
            },
          ],
        })),

      updateHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      archiveHabit: (id) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, archived: !h.archived } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => {
          const completions = { ...s.completions }
          delete completions[id]
          return { habits: s.habits.filter((h) => h.id !== id), completions }
        }),

      toggleCompletion: (habitId, dateISO) =>
        set((s) => {
          const habitLog = { ...(s.completions[habitId] ?? {}) }
          habitLog[dateISO] = !habitLog[dateISO]
          if (!habitLog[dateISO]) delete habitLog[dateISO]
          return { completions: { ...s.completions, [habitId]: habitLog } }
        }),

      isCompleted: (habitId, dateISO) => !!get().completions[habitId]?.[dateISO],

      addOutfit: (entry) =>
        set((s) => ({
          outfits: [
            { ...entry, id: uid(), createdAt: new Date().toISOString() },
            ...s.outfits,
          ],
        })),

      deleteOutfit: (id) =>
        set((s) => ({ outfits: s.outfits.filter((o) => o.id !== id) })),

      currentStreak: (habitId) => {
        const log = get().completions[habitId] ?? {}
        let streak = 0
        let cursor = todayISO()
        // if today not done yet, start counting from yesterday so an
        // unfinished today doesn't zero out an ongoing streak
        if (!log[cursor]) cursor = addDays(cursor, -1)
        while (log[cursor]) {
          streak++
          cursor = addDays(cursor, -1)
        }
        return streak
      },

      bestStreak: (habitId) => {
        const log = get().completions[habitId] ?? {}
        const dates = Object.keys(log).filter((d) => log[d]).sort()
        if (dates.length === 0) return 0
        let best = 1
        let run = 1
        for (let i = 1; i < dates.length; i++) {
          if (addDays(dates[i - 1], 1) === dates[i]) {
            run++
          } else {
            run = 1
          }
          if (run > best) best = run
        }
        return best
      },

      weeklyCompleted: (habitId, dateISO = todayISO()) => {
        const log = get().completions[habitId] ?? {}
        return weekDates(dateISO).filter((d) => log[d]).length
      },

      setRemindersEnabled: (enabled) =>
        set((s) => ({ reminders: { ...s.reminders, enabled } })),

      addReminderTime: (time) =>
        set((s) => {
          if (s.reminders.times.includes(time)) return s
          return {
            reminders: { ...s.reminders, times: [...s.reminders.times, time].sort() },
          }
        }),

      removeReminderTime: (time) =>
        set((s) => ({
          reminders: { ...s.reminders, times: s.reminders.times.filter((t) => t !== time) },
        })),

      markReminderFired: (time, dateISO) =>
        set((s) => ({ reminderLastFired: { ...s.reminderLastFired, [time]: dateISO } })),
    }),
    { name: 'sparkagain-storage' }
  )
)
