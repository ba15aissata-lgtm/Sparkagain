import { useMemo } from 'react'
import { Flame } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_STYLES } from '../data/categoryStyles'
import { formatLong, todayISO } from '../lib/date'
import type { CategoryId } from '../types'

export function Today() {
  const allHabits = useStore((s) => s.habits)
  const habits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits])
  const toggleCompletion = useStore((s) => s.toggleCompletion)
  const completions = useStore((s) => s.completions)
  const currentStreak = useStore((s) => s.currentStreak)
  const date = todayISO()
  const isCompleted = (habitId: string, d: string) => !!completions[habitId]?.[d]

  const doneCount = habits.filter((h) => isCompleted(h.id, date)).length
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <header className="mb-6">
        <p className="text-sm text-neutral-500">{formatLong(date)}</p>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Today's checklist
        </h1>
      </header>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-black/10 dark:text-white/10" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
              strokeLinecap="round"
              className="text-violet-500"
            />
          </svg>
          <span className="absolute text-sm font-semibold text-neutral-900 dark:text-white">
            {pct}%
          </span>
        </div>
        <div>
          <p className="font-medium text-neutral-900 dark:text-white">
            {doneCount} / {habits.length} done
          </p>
          <p className="text-sm text-neutral-500">
            {pct === 100 && habits.length > 0
              ? 'Perfect day. Keep the streak alive.'
              : 'Stay disciplined, check them off as you go.'}
          </p>
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const catHabits = habits.filter((h) => h.category === cat.id)
        if (catHabits.length === 0) return null
        const style = CATEGORY_STYLES[cat.id as CategoryId]
        return (
          <section key={cat.id} className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${style.dot}`} />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {cat.emoji} {cat.label}
              </h2>
            </div>
            <div className="space-y-2">
              {catHabits.map((h) => {
                const done = isCompleted(h.id, date)
                const streak = currentStreak(h.id)
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleCompletion(h.id, date)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                      done
                        ? `${style.border} ${style.bgSoft}`
                        : 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        done
                          ? `${style.bg} border-transparent text-white`
                          : 'border-neutral-300 dark:border-neutral-600'
                      }`}
                    >
                      {done && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`flex-1 text-sm font-medium ${
                        done ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {h.name}
                    </span>
                    {streak > 0 && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-orange-500">
                        <Flame size={13} className="fill-orange-500" />
                        {streak}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      {habits.length === 0 && (
        <p className="mt-10 text-center text-sm text-neutral-500">
          No habits yet. Add some in the Manage tab.
        </p>
      )}
    </div>
  )
}
