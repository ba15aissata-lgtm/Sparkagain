import { useState } from 'react'
import { Archive, ArchiveRestore, Plus, Star, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { KID_COLOR_IDS, KID_COLOR_STYLES, KID_EMOJI_OPTIONS, type KidColorId } from '../data/kidColors'
import { KidAvatar } from './KidAvatar'

export function Kids() {
  const kids = useStore((s) => s.kids)
  const addKid = useStore((s) => s.addKid)
  const updateKid = useStore((s) => s.updateKid)
  const archiveKid = useStore((s) => s.archiveKid)
  const deleteKid = useStore((s) => s.deleteKid)
  const kidBalance = useStore((s) => s.kidBalance)

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [emoji, setEmoji] = useState(KID_EMOJI_OPTIONS[0])
  const [color, setColor] = useState<KidColorId>('violet')
  const [showArchived, setShowArchived] = useState(false)

  function submit() {
    if (!name.trim()) return
    const ageNum = age.trim() ? Number(age) : null
    addKid(name.trim(), Number.isFinite(ageNum) ? ageNum : null, emoji, color)
    setName('')
    setAge('')
  }

  const visibleKids = kids.filter((k) => k.archived === showArchived)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Kids</h1>

      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <label className="mb-1 block text-xs font-medium text-neutral-500">Add a kid</label>
        <div className="mb-3 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="flex-1 rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700"
          />
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Age"
            inputMode="numeric"
            className="w-20 rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700"
          />
        </div>

        <span className="mb-1.5 block text-xs font-medium text-neutral-500">Avatar</span>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {KID_EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg ${
                emoji === e ? 'border-amber-500 bg-amber-500/10' : 'border-black/10 dark:border-white/10'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <span className="mb-1.5 block text-xs font-medium text-neutral-500">Color</span>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {KID_COLOR_IDS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full ${KID_COLOR_STYLES[c].bg} ${
                color === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 ' + KID_COLOR_STYLES[c].ring : ''
              }`}
            />
          ))}
        </div>

        <button
          onClick={submit}
          disabled={!name.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Plus size={16} /> Add kid
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {showArchived ? 'Archived' : 'Active'} kids
        </h2>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="text-xs font-medium text-amber-600 dark:text-amber-400"
        >
          {showArchived ? 'Show active' : 'Show archived'}
        </button>
      </div>

      <div className="space-y-2">
        {visibleKids.map((kid) => {
          const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
          return (
            <div key={kid.id} className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <KidAvatar kid={kid} size="lg" />
                <div className="flex-1">
                  <input
                    value={kid.name}
                    onChange={(e) => updateKid(kid.id, { name: e.target.value })}
                    className="w-full bg-transparent text-sm font-medium text-neutral-800 outline-none dark:text-neutral-200"
                  />
                  <p className="text-xs text-neutral-500">{kid.age != null ? `${kid.age} years old` : 'Age not set'}</p>
                </div>
                <span className={`flex items-center gap-1 text-lg font-bold ${style.text}`}>
                  <Star size={16} className="fill-current" /> {kidBalance(kid.id)}
                </span>
                <button
                  onClick={() => archiveKid(kid.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                  title={showArchived ? 'Restore' : 'Archive'}
                >
                  {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                </button>
                <button
                  onClick={() => deleteKid(kid.id)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
        {visibleKids.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            {showArchived ? 'No archived kids.' : 'No kids yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
