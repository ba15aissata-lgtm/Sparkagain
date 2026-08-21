import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chore, Completions, Kid, PointEntry, Redemption, Reward } from '../types'
import { SEED_CHORES, SEED_KIDS, SEED_REWARDS } from '../data/seed'
import { todayISO } from '../lib/date'

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

interface State {
  kids: Kid[]
  chores: Chore[]
  completions: Completions
  pointEntries: PointEntry[]
  rewards: Reward[]
  redemptions: Redemption[]

  addKid: (name: string, age: number | null, emoji: string, color: string) => void
  updateKid: (id: string, patch: Partial<Kid>) => void
  archiveKid: (id: string) => void
  deleteKid: (id: string) => void

  addChore: (chore: Omit<Chore, 'id' | 'archived' | 'createdAt'>) => void
  updateChore: (id: string, patch: Partial<Chore>) => void
  archiveChore: (id: string) => void
  deleteChore: (id: string) => void

  toggleCompletion: (choreId: string, kidId: string, dateISO: string) => void

  addReward: (name: string, emoji: string, cost: number) => void
  updateReward: (id: string, patch: Partial<Reward>) => void
  archiveReward: (id: string) => void
  deleteReward: (id: string) => void

  redeem: (kidId: string, rewardId: string) => boolean
  deleteRedemption: (id: string) => void

  kidBalance: (kidId: string) => number
}

const seedKids: Kid[] = SEED_KIDS.map((k) => ({
  id: uid(),
  name: k.name,
  age: k.age,
  emoji: k.emoji,
  color: k.color,
  archived: false,
  createdAt: todayISO(),
}))
const seedKidIds = seedKids.map((k) => k.id)

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      kids: seedKids,
      chores: SEED_CHORES.map((c) => ({
        id: uid(),
        name: c.name,
        category: c.category,
        points: c.points,
        frequency: c.frequency,
        weekdays: c.weekdays,
        kidIds: seedKidIds,
        archived: false,
        createdAt: todayISO(),
      })),
      completions: {},
      pointEntries: [],
      rewards: SEED_REWARDS.map((r) => ({
        id: uid(),
        name: r.name,
        emoji: r.emoji,
        cost: r.cost,
        archived: false,
        createdAt: todayISO(),
      })),
      redemptions: [],

      addKid: (name, age, emoji, color) =>
        set((s) => ({
          kids: [
            ...s.kids,
            { id: uid(), name, age, emoji, color, archived: false, createdAt: todayISO() },
          ],
        })),

      updateKid: (id, patch) =>
        set((s) => ({ kids: s.kids.map((k) => (k.id === id ? { ...k, ...patch } : k)) })),

      archiveKid: (id) =>
        set((s) => ({
          kids: s.kids.map((k) => (k.id === id ? { ...k, archived: !k.archived } : k)),
        })),

      deleteKid: (id) =>
        set((s) => ({
          kids: s.kids.filter((k) => k.id !== id),
          chores: s.chores.map((c) => ({ ...c, kidIds: c.kidIds.filter((kid) => kid !== id) })),
          pointEntries: s.pointEntries.filter((p) => p.kidId !== id),
          redemptions: s.redemptions.filter((r) => r.kidId !== id),
        })),

      addChore: (chore) =>
        set((s) => ({
          chores: [...s.chores, { ...chore, id: uid(), archived: false, createdAt: todayISO() }],
        })),

      updateChore: (id, patch) =>
        set((s) => ({ chores: s.chores.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),

      archiveChore: (id) =>
        set((s) => ({
          chores: s.chores.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)),
        })),

      deleteChore: (id) =>
        set((s) => {
          const completions = { ...s.completions }
          delete completions[id]
          return { chores: s.chores.filter((c) => c.id !== id), completions }
        }),

      toggleCompletion: (choreId, kidId, dateISO) =>
        set((s) => {
          const chore = s.chores.find((c) => c.id === choreId)
          if (!chore) return s
          const kidLog = { ...(s.completions[choreId]?.[kidId] ?? {}) }
          const wasDone = !!kidLog[dateISO]
          let pointEntries = s.pointEntries
          if (wasDone) {
            delete kidLog[dateISO]
            pointEntries = pointEntries.filter(
              (p) => !(p.choreId === choreId && p.kidId === kidId && p.date === dateISO)
            )
          } else {
            kidLog[dateISO] = true
            pointEntries = [
              ...pointEntries,
              {
                id: uid(),
                kidId,
                choreId,
                choreName: chore.name,
                points: chore.points,
                date: dateISO,
                createdAt: new Date().toISOString(),
              },
            ]
          }
          return {
            completions: {
              ...s.completions,
              [choreId]: { ...s.completions[choreId], [kidId]: kidLog },
            },
            pointEntries,
          }
        }),

      addReward: (name, emoji, cost) =>
        set((s) => ({
          rewards: [
            ...s.rewards,
            { id: uid(), name, emoji, cost, archived: false, createdAt: todayISO() },
          ],
        })),

      updateReward: (id, patch) =>
        set((s) => ({ rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),

      archiveReward: (id) =>
        set((s) => ({
          rewards: s.rewards.map((r) => (r.id === id ? { ...r, archived: !r.archived } : r)),
        })),

      deleteReward: (id) =>
        set((s) => ({ rewards: s.rewards.filter((r) => r.id !== id) })),

      redeem: (kidId, rewardId) => {
        const reward = get().rewards.find((r) => r.id === rewardId)
        if (!reward) return false
        if (get().kidBalance(kidId) < reward.cost) return false
        set((s) => ({
          redemptions: [
            {
              id: uid(),
              kidId,
              rewardId,
              rewardName: reward.name,
              rewardEmoji: reward.emoji,
              cost: reward.cost,
              date: todayISO(),
              createdAt: new Date().toISOString(),
            },
            ...s.redemptions,
          ],
        }))
        return true
      },

      deleteRedemption: (id) =>
        set((s) => ({ redemptions: s.redemptions.filter((r) => r.id !== id) })),

      kidBalance: (kidId) => {
        const earned = get()
          .pointEntries.filter((p) => p.kidId === kidId)
          .reduce((sum, p) => sum + p.points, 0)
        const spent = get()
          .redemptions.filter((r) => r.kidId === kidId)
          .reduce((sum, r) => sum + r.cost, 0)
        return earned - spent
      },
    }),
    { name: 'chorestars-storage' }
  )
)
