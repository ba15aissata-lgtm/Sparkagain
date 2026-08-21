import { useState } from 'react'
import { Archive, ArchiveRestore, Check, Minus, Plus, Star, Trash2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { KID_COLOR_STYLES, type KidColorId } from '../data/kidColors'
import { KidAvatar } from './KidAvatar'

const EMOJI_OPTIONS = ['🎮', '🎬', '🌙', '🍕', '🎟️', '💵', '🍦', '🎨', '📱', '🧸', '🚲', '🏖️']

export function Rewards() {
  const rewards = useStore((s) => s.rewards)
  const kids = useStore((s) => s.kids)
  const activeKids = kids.filter((k) => !k.archived)
  const addReward = useStore((s) => s.addReward)
  const archiveReward = useStore((s) => s.archiveReward)
  const deleteReward = useStore((s) => s.deleteReward)
  const redeem = useStore((s) => s.redeem)
  const kidBalance = useStore((s) => s.kidBalance)

  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0])
  const [cost, setCost] = useState(20)
  const [showArchived, setShowArchived] = useState(false)
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null)

  function submit() {
    if (!name.trim()) return
    addReward(name.trim(), emoji, cost)
    setName('')
    setCost(20)
  }

  function handleRedeem(kidId: string, rewardId: string) {
    const ok = redeem(kidId, rewardId)
    if (ok) {
      setJustRedeemed(`${kidId}:${rewardId}`)
      setTimeout(() => setJustRedeemed(null), 1500)
    }
  }

  const visibleRewards = rewards.filter((r) => r.archived === showArchived)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-4 text-2xl font-semibold text-neutral-900 dark:text-white">Rewards</h1>

      {activeKids.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {activeKids.map((kid) => {
            const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
            return (
              <div key={kid.id} className={`flex shrink-0 items-center gap-2 rounded-2xl border ${style.border} ${style.bgSoft} px-3 py-2`}>
                <KidAvatar kid={kid} size="sm" />
                <div>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{kid.name}</p>
                  <p className={`flex items-center gap-0.5 text-sm font-bold ${style.text}`}>
                    <Star size={12} className="fill-current" /> {kidBalance(kid.id)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <label className="mb-1 block text-xs font-medium text-neutral-500">New reward</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="e.g. Friend sleepover"
          className="mb-3 w-full rounded-lg border border-neutral-300 bg-transparent p-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700"
        />
        <span className="mb-1.5 block text-xs font-medium text-neutral-500">Icon</span>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {EMOJI_OPTIONS.map((e) => (
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
        <div className="mb-3 flex items-center justify-between rounded-lg border border-neutral-200 p-2.5 dark:border-neutral-700">
          <span className="text-xs font-medium text-neutral-500">Cost</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCost((p) => Math.max(5, p - 5))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 dark:border-neutral-600"
            >
              <Minus size={12} />
            </button>
            <span className="flex w-16 items-center justify-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Star size={13} className="fill-current" /> {cost}
            </span>
            <button
              onClick={() => setCost((p) => Math.min(500, p + 5))}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 dark:border-neutral-600"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Plus size={16} /> Add reward
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {showArchived ? 'Archived' : 'Available'} rewards
        </h2>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="text-xs font-medium text-amber-600 dark:text-amber-400"
        >
          {showArchived ? 'Show available' : 'Show archived'}
        </button>
      </div>

      <div className="space-y-2">
        {visibleRewards.map((reward) => (
          <div key={reward.id} className="rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{reward.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{reward.name}</p>
                <p className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
                  <Star size={11} className="fill-current" /> {reward.cost}
                </p>
              </div>
              <button
                onClick={() => archiveReward(reward.id)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-black/5 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-neutral-200"
                title={showArchived ? 'Restore' : 'Archive'}
              >
                {showArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
              </button>
              <button
                onClick={() => deleteReward(reward.id)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {!showArchived && activeKids.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-black/5 pt-2.5 dark:border-white/5">
                {activeKids.map((kid) => {
                  const affordable = kidBalance(kid.id) >= reward.cost
                  const redeemed = justRedeemed === `${kid.id}:${reward.id}`
                  return (
                    <button
                      key={kid.id}
                      onClick={() => handleRedeem(kid.id, reward.id)}
                      disabled={!affordable}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        redeemed
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                          : affordable
                            ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            : 'border-black/10 text-neutral-300 dark:border-white/10 dark:text-neutral-600'
                      }`}
                    >
                      {redeemed ? <Check size={13} /> : <span>{kid.emoji}</span>}
                      {redeemed ? 'Redeemed!' : `Give to ${kid.name}`}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}
        {visibleRewards.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">
            {showArchived ? 'No archived rewards.' : 'No rewards yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
