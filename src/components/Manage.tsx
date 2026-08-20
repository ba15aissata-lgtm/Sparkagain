import { useState } from 'react'
import { Archive, ArchiveRestore, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_STYLES } from '../data/categoryStyles'
import type { CategoryId } from '../types'

export function Manage() {
  const habits = useStore((s) => s.habits)
  const addHabit = useStore((s) => s.addHabit)
  const archiveHabit = useStore((s) => s.archiveHabit)
  const deleteHabit = useStore((s) => s.deleteHabit)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<CategoryId>('discipline')
  const [showArchived, setShowArchived] = useState(false)

  function submit() {
    if (!name.trim()) return
    addHabit(name.trim(), category)
    setName('')
  }

  const visibleHabits = habits.filter((h) => h.archived === showArchived)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Manage habits</h1>

      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <label className="mb-1 block text-xs font-medium text-neutral-500">New habit</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="e.g. Floss teeth"
          className="mb-3 w-full rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-violet-500 dark:border-neutral-700"
        />
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const style = CATEGORY_STYLES[c.id]
            const active = category === c.id
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  active ? `${style.bg} border-transparent text-white` : `border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300`
                }`}
              >
                {c.emoji} {c.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Plus size={16} /> Add habit
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {showArchived ? 'Archived' : 'Active'} habits
        </h2>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="text-xs font-medium text-violet-600 dark:text-violet-400"
        >
          {showArchived ? 'Show active' : 'Show archived'}
        </button>
      </div>

      <div className="space-y-2">
        {visibleHabits.map((h) => {
          const cat = CATEGORIES.find((c) => c.id === h.category)!
          const style = CATEGORY_STYLES[h.category]
          return (
            <div
              key={h.id}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{h.name}</p>
                <p className="text-xs text-neutral-500">
                  {cat.emoji} {cat.label}
                </p>
              </div>
              <button
                onClick={() => archiveHabit(h.id)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                title={showArchived ? 'Restore' : 'Archive'}
              >
                {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
              </button>
              <button
                onClick={() => deleteHabit(h.id)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}
        {visibleHabits.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            {showArchived ? 'No archived habits.' : 'No active habits.'}
          </p>
        )}
      </div>
    </div>
  )
}
