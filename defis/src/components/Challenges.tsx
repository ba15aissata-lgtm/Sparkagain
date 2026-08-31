import { useState } from 'react'
import { Archive, ArchiveRestore, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { RuleText } from './RuleText'
import { showToast } from '../lib/toast'

export function Challenges() {
  const challenges = useStore((s) => s.challenges)
  const progress = useStore((s) => s.progress)
  const addChallenge = useStore((s) => s.addChallenge)
  const archiveChallenge = useStore((s) => s.archiveChallenge)
  const deleteChallenge = useStore((s) => s.deleteChallenge)
  const resetChallengeProgress = useStore((s) => s.resetChallengeProgress)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [totalDays, setTotalDays] = useState(75)
  const [currency, setCurrency] = useState('FCFA')
  const [penaltyMin, setPenaltyMin] = useState(100)
  const [penaltyMax, setPenaltyMax] = useState(500)
  const [penaltyStep, setPenaltyStep] = useState(50)
  const [rules, setRules] = useState<string[]>([''])
  const [showArchived, setShowArchived] = useState(false)

  function updateRule(i: number, value: string) {
    setRules((prev) => prev.map((r, idx) => (idx === i ? value : r)))
  }
  function addRuleField() {
    setRules((prev) => [...prev, ''])
  }
  function removeRuleField(i: number) {
    setRules((prev) => prev.filter((_, idx) => idx !== i))
  }

  function resetForm() {
    setName('')
    setTotalDays(75)
    setCurrency('FCFA')
    setPenaltyMin(100)
    setPenaltyMax(500)
    setPenaltyStep(50)
    setRules([''])
    setShowForm(false)
  }

  function submit() {
    const cleanRules = rules.map((r) => r.trim()).filter(Boolean)
    if (!name.trim() || cleanRules.length === 0 || totalDays < 1) return
    addChallenge({
      name: name.trim(),
      totalDays,
      currency: currency.trim() || 'FCFA',
      penaltyMin,
      penaltyMax: Math.max(penaltyMax, penaltyMin),
      penaltyStep: Math.max(1, penaltyStep),
      rules: cleanRules,
    })
    showToast('Défi créé.')
    resetForm()
  }

  const visible = challenges.filter((c) => c.archived === showArchived)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-6 text-xl font-semibold tracking-wide">Défis</h1>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mb-6 flex w-full items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-semibold"
        >
          <Plus size={16} /> Nouveau défi
        </button>
      ) : (
        <div className="card mb-6 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Nouveau défi</h2>
            <button onClick={resetForm} style={{ color: 'var(--text-dim)' }}>
              <X size={18} />
            </button>
          </div>

          <label className="mb-1 block text-xs" style={{ color: 'var(--text-dim)' }}>
            Nom du défi
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Défi 75 Jours — pt2"
            className="card2 mb-3 w-full rounded-lg p-2.5 text-sm outline-none"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          />

          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs" style={{ color: 'var(--text-dim)' }}>
                Durée (jours)
              </label>
              <input
                type="number"
                min={1}
                value={totalDays}
                onChange={(e) => setTotalDays(Math.max(1, Number(e.target.value) || 1))}
                className="card2 w-full rounded-lg p-2.5 text-sm outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs" style={{ color: 'var(--text-dim)' }}>
                Devise
              </label>
              <input
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="card2 w-full rounded-lg p-2.5 text-sm outline-none"
                style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <label className="mb-1 block text-xs" style={{ color: 'var(--text-dim)' }}>
            Pénalité en cas d'échec (min / max / pas)
          </label>
          <div className="mb-3 flex gap-2">
            <input
              type="number"
              value={penaltyMin}
              onChange={(e) => setPenaltyMin(Number(e.target.value) || 0)}
              className="card2 w-full rounded-lg p-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <input
              type="number"
              value={penaltyMax}
              onChange={(e) => setPenaltyMax(Number(e.target.value) || 0)}
              className="card2 w-full rounded-lg p-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <input
              type="number"
              value={penaltyStep}
              onChange={(e) => setPenaltyStep(Number(e.target.value) || 1)}
              className="card2 w-full rounded-lg p-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <label className="mb-1.5 block text-xs" style={{ color: 'var(--text-dim)' }}>
            Règles (utilise **texte** pour mettre en gras)
          </label>
          <div className="mb-2 space-y-1.5">
            {rules.map((r, i) => (
              <div key={i} className="flex gap-1.5">
                <input
                  value={r}
                  onChange={(e) => updateRule(i, e.target.value)}
                  placeholder="ex: **30 min** d'activité physique"
                  className="card2 w-full rounded-lg p-2 text-sm outline-none"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                {rules.length > 1 && (
                  <button
                    onClick={() => removeRuleField(i)}
                    className="shrink-0 rounded-lg px-2"
                    style={{ color: 'var(--fail)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addRuleField}
            className="mb-3 flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            <Plus size={13} /> Ajouter une règle
          </button>

          <button
            onClick={submit}
            disabled={!name.trim() || rules.every((r) => !r.trim())}
            className="btn-primary w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-40"
          >
            Créer le défi
          </button>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
          {showArchived ? 'Archivés' : 'Actifs'}
        </h2>
        <button
          onClick={() => setShowArchived((v) => !v)}
          className="text-xs font-medium"
          style={{ color: 'var(--accent)' }}
        >
          {showArchived ? 'Voir les actifs' : 'Voir les archivés'}
        </button>
      </div>

      <div className="space-y-3">
        {visible.map((challenge) => {
          const prog = progress[challenge.id]
          return (
            <div key={challenge.id} className="card p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{challenge.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    {challenge.totalDays} jours · {challenge.rules.length} règle{challenge.rules.length === 1 ? '' : 's'} · pénalité{' '}
                    {challenge.penaltyMin}–{challenge.penaltyMax} {challenge.currency}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => {
                      if (confirm('Remettre ce défi à zéro (efface son historique) ?')) {
                        resetChallengeProgress(challenge.id)
                        showToast('Défi réinitialisé.')
                      }
                    }}
                    className="rounded-lg p-1.5"
                    style={{ color: 'var(--text-dim)' }}
                    title="Réinitialiser"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    onClick={() => archiveChallenge(challenge.id)}
                    className="rounded-lg p-1.5"
                    style={{ color: 'var(--text-dim)' }}
                    title={showArchived ? 'Restaurer' : 'Archiver'}
                  >
                    {showArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer ce défi et tout son historique ?')) deleteChallenge(challenge.id)
                    }}
                    className="rounded-lg p-1.5"
                    style={{ color: 'var(--fail)' }}
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <ul className="space-y-1 border-t pt-2" style={{ borderColor: 'var(--border)' }}>
                {challenge.rules.map((r) => (
                  <li key={r.id} className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    · <RuleText text={r.text} />
                  </li>
                ))}
              </ul>
              {prog && (
                <p className="mt-2 text-xs" style={{ color: 'var(--text-dim)' }}>
                  Jour {Math.min(prog.currentDay, challenge.totalDays)}/{challenge.totalDays} · {prog.vaultTotal}{' '}
                  {challenge.currency} au coffre · {prog.restartCount} restarts
                </p>
              )}
            </div>
          )
        })}
        {visible.length === 0 && (
          <p className="py-6 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
            {showArchived ? 'Aucun défi archivé.' : 'Aucun défi.'}
          </p>
        )}
      </div>
    </div>
  )
}
