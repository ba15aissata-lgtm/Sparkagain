import { useMemo, useState } from 'react'
import { Minus, Star, Trophy } from 'lucide-react'
import { useStore } from '../store/useStore'
import { KID_COLOR_STYLES, type KidColorId } from '../data/kidColors'
import { KidAvatar } from './KidAvatar'
import { formatShort, formatTime, todayISO, weekDates } from '../lib/date'

const MEDALS = ['🥇', '🥈', '🥉']

export function History() {
  const kids = useStore((s) => s.kids)
  const pointEntries = useStore((s) => s.pointEntries)
  const redemptions = useStore((s) => s.redemptions)
  const [filter, setFilter] = useState<string>('all')

  const thisWeek = useMemo(() => new Set(weekDates(todayISO())), [])

  const leaderboard = useMemo(() => {
    return kids
      .filter((k) => !k.archived)
      .map((kid) => ({
        kid,
        points: pointEntries
          .filter((p) => p.kidId === kid.id && thisWeek.has(p.date))
          .reduce((sum, p) => sum + p.points, 0),
      }))
      .sort((a, b) => b.points - a.points)
  }, [kids, pointEntries, thisWeek])

  const feed = useMemo(() => {
    const earned = pointEntries.map((p) => ({
      id: p.id,
      kidId: p.kidId,
      label: p.choreName,
      amount: p.points,
      createdAt: p.createdAt,
    }))
    const spent = redemptions.map((r) => ({
      id: r.id,
      kidId: r.kidId,
      label: `${r.rewardEmoji} ${r.rewardName}`,
      amount: -r.cost,
      createdAt: r.createdAt,
    }))
    return [...earned, ...spent]
      .filter((e) => filter === 'all' || e.kidId === filter)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 60)
  }, [pointEntries, redemptions, filter])

  const kidById = (id: string) => kids.find((k) => k.id === id)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">History</h1>

      {leaderboard.length > 0 && (
        <>
          <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            <Trophy size={14} /> This week's leaderboard
          </h2>
          <div className="mb-6 space-y-2">
            {leaderboard.map(({ kid, points }, i) => {
              const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
              return (
                <div
                  key={kid.id}
                  className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
                >
                  <span className="w-6 text-center text-lg">{MEDALS[i] ?? `${i + 1}`}</span>
                  <KidAvatar kid={kid} size="sm" />
                  <span className="flex-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">{kid.name}</span>
                  <span className={`flex items-center gap-1 text-sm font-bold ${style.text}`}>
                    <Star size={13} className="fill-current" /> {points}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}

      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            filter === 'all' ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
          }`}
        >
          All
        </button>
        {kids.map((kid) => (
          <button
            key={kid.id}
            onClick={() => setFilter(kid.id)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              filter === kid.id ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-black/10 text-neutral-600 dark:border-white/10 dark:text-neutral-300'
            }`}
          >
            {kid.emoji} {kid.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {feed.map((entry) => {
          const kid = kidById(entry.kidId)
          if (!kid) return null
          return (
            <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <KidAvatar kid={kid} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{entry.label}</p>
                <p className="text-xs text-neutral-500">
                  {kid.name} · {formatShort(entry.createdAt.slice(0, 10))} · {formatTime(entry.createdAt)}
                </p>
              </div>
              <span
                className={`flex items-center gap-0.5 text-sm font-bold ${
                  entry.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                }`}
              >
                {entry.amount >= 0 ? <Star size={13} className="fill-current" /> : <Minus size={13} />}
                {entry.amount >= 0 ? entry.amount : Math.abs(entry.amount)}
              </span>
            </div>
          )
        })}
        {feed.length === 0 && (
          <p className="py-6 text-center text-sm text-neutral-500">No activity yet.</p>
        )}
      </div>
    </div>
  )
}
