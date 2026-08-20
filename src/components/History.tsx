import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { daysInMonth, isoWeekday, toISO, todayISO } from '../lib/date'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function History() {
  const allHabits = useStore((s) => s.habits)
  const habits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits])
  const completions = useStore((s) => s.completions)
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [selected, setSelected] = useState<string | null>(todayISO())

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const cells = useMemo(() => {
    const total = daysInMonth(cursor.year, cursor.month)
    const first = toISO(new Date(cursor.year, cursor.month, 1))
    const leadBlanks = isoWeekday(first)
    const out: { iso: string | null; pct: number }[] = []
    for (let i = 0; i < leadBlanks; i++) out.push({ iso: null, pct: 0 })
    for (let day = 1; day <= total; day++) {
      const iso = toISO(new Date(cursor.year, cursor.month, day))
      const activeHabits = habits.filter((h) => h.createdAt <= iso)
      const done = activeHabits.filter((h) => completions[h.id]?.[iso]).length
      const pct = activeHabits.length ? done / activeHabits.length : -1
      out.push({ iso, pct })
    }
    return out
  }, [cursor, habits, completions])

  const selectedHabits = selected
    ? habits.filter((h) => h.createdAt <= selected && completions[h.id]?.[selected])
    : []

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">History</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
            }
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="w-32 text-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {monthLabel}
          </span>
          <button
            onClick={() =>
              setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
            }
            className="rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-neutral-400">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c, i) =>
          c.iso === null ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => setSelected(c.iso)}
              className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                selected === c.iso ? 'ring-2 ring-violet-500 ring-offset-1 dark:ring-offset-neutral-950' : ''
              } ${heatColor(c.pct)}`}
            >
              {Number(c.iso.slice(-2))}
            </button>
          )
        )}
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
            {new Date(selected + 'T00:00:00').toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {selectedHabits.length === 0 ? (
            <p className="text-sm text-neutral-500">Nothing completed this day.</p>
          ) : (
            <ul className="space-y-1">
              {selectedHabits.map((h) => (
                <li key={h.id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {h.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function heatColor(pct: number): string {
  if (pct < 0) return 'bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-700'
  if (pct === 0) return 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
  if (pct < 0.34) return 'bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300'
  if (pct < 0.67) return 'bg-violet-400 text-white dark:bg-violet-700 dark:text-white'
  if (pct < 1) return 'bg-violet-600 text-white dark:bg-violet-600 dark:text-white'
  return 'bg-violet-800 text-white dark:bg-violet-500 dark:text-white'
}
