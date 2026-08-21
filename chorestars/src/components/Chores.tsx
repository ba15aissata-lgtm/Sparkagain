import { useState } from 'react'
import { Archive, ArchiveRestore, Minus, Plus, Star, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORY_STYLES, CHORE_CATEGORIES } from '../data/categories'
import { KidAvatar } from './KidAvatar'
import { WEEKDAY_LABELS } from '../lib/date'
import type { ChoreCategory } from '../types'

export function Chores() {
  const chores = useStore((s) => s.chores)
  const kids = useStore((s) => s.kids)
  const activeKids = kids.filter((k) => !k.archived)
  const addChore = useStore((s) => s.addChore)
  const archiveChore = useStore((s) => s.archiveChore)
  const deleteChore = useStore((s) => s.deleteChore)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<ChoreCategory>('cleaning')
  const [points, setPoints] = useState(5)
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [weekdays, setWeekdays] = useState<number[]>([])
  const [kidIds, setKidIds] = useState<string[]>(activeKids.map((k) => k.id))
  const [showArchived, setShowArchived] = useState(false)

  function toggleWeekday(d: number) {
    setWeekdays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()))
  }

  function toggleKid(id: string) {
    setKidIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function submit() {
    if (!name.trim() || kidIds.length === 0) return
    addChore({
      name: name.trim(),
      category,
      points,
      frequency,
      weekdays: frequency === 'weekly' ? weekdays : [],
      kidIds,
    })
    setName('')
    setPoints(5)
    setFrequency('daily')
    setWeekdays([])
  }

  const visibleChores = chores.filter((c) => c.archived === showArchived)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Chores</h1>

      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <label className="mb-1 block text-xs font-medium text-neutral-500">New chore</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="e.g. Fold laundry"
          className="mb-3 w-full rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700"
        />

        <div className="mb-3 flex flex-wrap gap-1.5">
          {CHORE_CATEGORIES.map((c) => {
            const style = CATEGORY_STYLES[c.id]
            const active = category === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  active ? `${style.bg} border-transparent text-white` : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            )
          })}
        </div>

        <div className="mb-3 flex items-center justify-between rounded-lg border border-neutral-200 p-2.5 dark:border-neutral-700">
          <span className="text-xs font-medium text-neutral-500">Stars for finishing</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPoints((p) => Math.max(1, p - 5))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 dark:border-neutral-600"
            >
              <Minus size={12} />
            </button>
            <span className="flex w-14 items-center justify-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Star size={13} className="fill-current" /> {points}
            </span>
            <button
              onClick={() => setPoints((p) => Math.min(100, p + 5))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 dark:border-neutral-600"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">How often</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setFrequency('daily')}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${
                frequency === 'daily' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
              }`}
            >
              Every day
            </button>
            <button
              onClick={() => setFrequency('weekly')}
              className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${
                frequency === 'weekly' ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
              }`}
            >
              Specific days
            </button>
          </div>
          {frequency === 'weekly' && (
            <div className="mt-2 flex gap-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleWeekday(i)}
                  className={`flex-1 rounded-md border py-1.5 text-[11px] font-medium ${
                    weekdays.includes(i) ? 'border-amber-500 bg-amber-500 text-white' : 'border-black/10 text-neutral-500 dark:border-white/10'
                  }`}
                >
                  {label[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <span className="mb-1.5 block text-xs font-medium text-neutral-500">Who's this for</span>
          <div className="flex flex-wrap gap-1.5">
            {activeKids.map((kid) => (
              <button
                key={kid.id}
                onClick={() => toggleKid(kid.id)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  kidIds.includes(kid.id) ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
                }`}
              >
                {kid.emoji} {kid.name}
              </button>
            ))}
            {activeKids.length === 0 && (
              <span className="text-xs text-neutral-400">Add a kid in the Kids tab first.</span>
            )}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!name.trim() || kidIds.length === 0}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Plus size={16} /> Add chore
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {showArchived ? 'Archived' : 'Active'} chores
        </h2>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="text-xs font-medium text-amber-600 dark:text-amber-400"
        >
          {showArchived ? 'Show active' : 'Show archived'}
        </button>
      </div>

      <div className="space-y-2">
        {visibleChores.map((chore) => {
          const cat = CHORE_CATEGORIES.find((c) => c.id === chore.category)!
          const assignedKids = kids.filter((k) => chore.kidIds.includes(k.id))
          return (
            <div key={chore.id} className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <span className="text-base leading-none">{cat.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{chore.name}</p>
                  <p className="text-xs text-neutral-500">
                    {cat.label} · {chore.frequency === 'daily' ? 'Every day' : chore.weekdays.map((d) => WEEKDAY_LABELS[d]).join(', ') || 'No days set'} ·{' '}
                    <span className="inline-flex items-center gap-0.5">
                      <Star size={10} className="fill-current text-amber-500" /> {chore.points}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => archiveChore(chore.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                  title={showArchived ? 'Restore' : 'Archive'}
                >
                  {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                </button>
                <button
                  onClick={() => deleteChore(chore.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-black/5 pt-2.5 dark:border-white/5">
                {assignedKids.map((k) => (
                  <div key={k.id} className="flex items-center gap-1">
                    <KidAvatar kid={k} size="sm" />
                  </div>
                ))}
                {assignedKids.length === 0 && <span className="text-xs text-neutral-400">Nobody assigned</span>}
              </div>
            </div>
          )
        })}
        {visibleChores.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            {showArchived ? 'No archived chores.' : 'No active chores.'}
          </p>
        )}
      </div>
    </div>
  )
}
