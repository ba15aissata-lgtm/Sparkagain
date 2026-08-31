import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { formatShort } from '../lib/date'

export function History() {
  const challenges = useStore((s) => s.challenges)
  const dayLogs = useStore((s) => s.dayLogs)
  const [filter, setFilter] = useState('all')

  const nameById = useMemo(() => {
    const map: Record<string, string> = {}
    for (const c of challenges) map[c.id] = c.name
    return map
  }, [challenges])

  const filtered = dayLogs.filter((l) => filter === 'all' || l.challengeId === filter)
  const successCount = filtered.filter((l) => l.success).length
  const failCount = filtered.filter((l) => !l.success).length

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-xl font-semibold tracking-wide">Historique</h1>

      {challenges.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="Tous" />
          {challenges.map((c) => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.name} />
          ))}
        </div>
      )}

      <div className="card mb-4 p-3">
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {successCount} réussis · {failCount} échecs
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
          Aucun jour enregistré pour l'instant.
        </p>
      ) : (
        <div className="card divide-y" style={{ borderColor: 'var(--border)' }}>
          {filtered.slice(0, 100).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between px-3 py-2.5 text-sm"
              style={{ borderColor: 'var(--border)', color: log.success ? 'var(--success)' : 'var(--fail)' }}
            >
              <span>
                {challenges.length > 1 && (
                  <span className="mr-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
                    {nameById[log.challengeId] ?? '—'} ·
                  </span>
                )}
                Jour {log.day} — {formatShort(log.date)}
                {!log.success && log.reason ? ` · ${log.reason}` : ''}
              </span>
              <span className="shrink-0 font-semibold">
                {log.success ? '✓ Réussi' : `✗ ${log.amount}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'rgba(224,102,61,0.12)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
      }}
    >
      {label}
    </button>
  )
}
