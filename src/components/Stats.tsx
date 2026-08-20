import { useMemo } from 'react'
import { CheckCircle2, Flame, Target, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_STYLES } from '../data/categoryStyles'
import { last7Days } from '../lib/date'
import type { CategoryId } from '../types'

export function Stats() {
  const allHabits = useStore((s) => s.habits)
  const habits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits])
  const completions = useStore((s) => s.completions)
  const currentStreak = useStore((s) => s.currentStreak)
  const bestStreak = useStore((s) => s.bestStreak)
  const weeklyCompleted = useStore((s) => s.weeklyCompleted)
  const weeklyHabits = habits.filter((h) => h.targetDaysPerWeek < 7)

  const days = last7Days()
  const totalPossible = habits.length * days.length
  const totalDone = habits.reduce(
    (sum, h) => sum + days.filter((d) => completions[h.id]?.[d]).length,
    0
  )
  const weekPct = totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0

  const topStreakHabit = [...habits].sort((a, b) => currentStreak(b.id) - currentStreak(a.id))[0]

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Stats</h1>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium text-neutral-500">Last 7 days</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-white">{weekPct}%</p>
          <p className="text-xs text-neutral-500">
            {totalDone}/{totalPossible} checks
          </p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="flex items-center gap-1 text-xs font-medium text-neutral-500">
            <Flame size={13} className="text-orange-500" /> Best streak
          </p>
          <p className="mt-1 truncate text-lg font-bold text-neutral-900 dark:text-white">
            {topStreakHabit ? currentStreak(topStreakHabit.id) : 0} days
          </p>
          <p className="truncate text-xs text-neutral-500">{topStreakHabit?.name ?? '—'}</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        7-day trend
      </h2>
      <div className="mb-6 flex items-end gap-2 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        {days.map((d) => {
          const done = habits.filter((h) => completions[h.id]?.[d]).length
          const pct = habits.length ? done / habits.length : 0
          return (
            <div key={d} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-24 w-full items-end overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="w-full rounded-md bg-violet-500 transition-all"
                  style={{ height: `${Math.max(pct * 100, 4)}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400">{d.slice(5)}</span>
            </div>
          )
        })}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        By category
      </h2>
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const catHabits = habits.filter((h) => h.category === cat.id)
          if (catHabits.length === 0) return null
          const style = CATEGORY_STYLES[cat.id as CategoryId]
          const possible = catHabits.length * days.length
          const done = catHabits.reduce(
            (sum, h) => sum + days.filter((d) => completions[h.id]?.[d]).length,
            0
          )
          const pct = possible ? Math.round((done / possible) * 100) : 0
          return (
            <div key={cat.id} className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {cat.emoji} {cat.label}
                </span>
                <span className="text-neutral-500">{pct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className={`h-full rounded-full ${style.bg}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {weeklyHabits.length > 0 && (
        <>
          <h2 className="mb-3 mt-6 flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Target size={14} /> Weekly goals
          </h2>
          <div className="space-y-2">
            {weeklyHabits.map((h) => {
              const count = weeklyCompleted(h.id)
              const met = count >= h.targetDaysPerWeek
              const style = CATEGORY_STYLES[h.category]
              return (
                <div
                  key={h.id}
                  className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                      {met && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {h.name}
                    </span>
                    <span className="text-neutral-500">
                      {count}/{h.targetDaysPerWeek}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={`h-full rounded-full ${met ? 'bg-emerald-500' : style.bg}`}
                      style={{ width: `${Math.min(100, (count / h.targetDaysPerWeek) * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <h2 className="mb-3 mt-6 flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        <Trophy size={14} /> All-time best streaks
      </h2>
      <div className="space-y-2">
        {[...habits]
          .sort((a, b) => bestStreak(b.id) - bestStreak(a.id))
          .slice(0, 5)
          .map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-3 text-sm dark:border-white/10 dark:bg-neutral-900"
            >
              <span className="text-neutral-800 dark:text-neutral-200">{h.name}</span>
              <span className="flex items-center gap-1 font-semibold text-orange-500">
                <Flame size={13} className="fill-orange-500" /> {bestStreak(h.id)}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
