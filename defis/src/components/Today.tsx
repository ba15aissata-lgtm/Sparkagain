import { useMemo, useState } from 'react'
import { useStore, freshTodayChecks } from '../store/useStore'
import { RuleText } from './RuleText'
import { showToast } from '../lib/toast'
import type { Challenge, ChallengeProgress } from '../types'

export function Today() {
  const allChallenges = useStore((s) => s.challenges)
  const challenges = useMemo(() => allChallenges.filter((c) => !c.archived), [allChallenges])
  const progress = useStore((s) => s.progress)

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <h1 className="mb-1 text-xl font-semibold tracking-wide">Défis en cours</h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-dim)' }}>
        Un jour raté remet le compteur à Jour 1. La pression est réelle.
      </p>

      {challenges.length === 0 && (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--text-dim)' }}>
          Aucun défi actif. Crée-en un dans l'onglet Défis.
        </p>
      )}

      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} progress={progress[challenge.id]} />
      ))}
    </div>
  )
}

function ChallengeCard({ challenge, progress }: { challenge: Challenge; progress: ChallengeProgress }) {
  const toggleRuleCheck = useStore((s) => s.toggleRuleCheck)
  const validateDay = useStore((s) => s.validateDay)
  const declareFail = useStore((s) => s.declareFail)

  const [failOpen, setFailOpen] = useState(false)
  const [amount, setAmount] = useState(
    Math.round((challenge.penaltyMin + challenge.penaltyMax) / 2 / challenge.penaltyStep) * challenge.penaltyStep
  )
  const [reason, setReason] = useState('')

  const checks = freshTodayChecks(progress, challenge.rules.length)
  const allChecked = checks.length > 0 && checks.every(Boolean)
  const done = progress.currentDay > challenge.totalDays

  function handleValidate() {
    validateDay(challenge.id)
    if (progress.currentDay + 1 > challenge.totalDays) {
      showToast(`🎉 ${challenge.totalDays} jours complétés !`)
    } else {
      showToast(`Jour validé. Jour ${progress.currentDay + 1} commence.`)
    }
  }

  function handleFail() {
    declareFail(challenge.id, amount, reason)
    showToast(`${amount} ${challenge.currency} dans le coffre. Retour au Jour 1.`)
    setFailOpen(false)
    setReason('')
  }

  return (
    <div className="mb-6">
      <div className="mb-3 grid grid-cols-4 gap-2">
        <Stat value={done ? `${challenge.totalDays}/${challenge.totalDays}` : String(progress.currentDay)} label={done ? 'Terminé' : 'Jour'} color="var(--accent)" />
        <Stat value={String(progress.bestStreak)} label="Streak" />
        <Stat value={String(progress.vaultTotal)} label={challenge.currency} color="var(--vault)" />
        <Stat value={String(progress.restartCount)} label="Restarts" />
      </div>

      <div className="card p-4">
        <h2 className="mb-3 text-sm font-semibold">{challenge.name}</h2>

        {done ? (
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            🎉 Défi complété. {progress.vaultTotal} {challenge.currency} sont dans le coffre.
            Décide maintenant ce qui devient permanent.
          </p>
        ) : (
          <>
            <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
              Jour {progress.currentDay}
            </p>
            <div className="mb-2 space-y-1.5">
              {challenge.rules.map((rule, i) => {
                const isChecked = checks[i]
                return (
                  <label
                    key={rule.id}
                    className={`rule-row flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 ${isChecked ? 'checked' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleRuleCheck(challenge.id, i)
                    }}
                  >
                    <input type="checkbox" checked={!!isChecked} readOnly className="h-5 w-5 shrink-0" style={{ accentColor: 'var(--success)' }} />
                    <span className="text-sm leading-snug">
                      <RuleText text={rule.text} />
                    </span>
                  </label>
                )
              })}
            </div>

            <button
              onClick={handleValidate}
              disabled={!allChecked}
              className="btn-primary mt-2 w-full rounded-lg py-3 text-sm font-semibold"
            >
              {allChecked
                ? 'Valider la journée ✓'
                : challenge.rules.length === 1
                  ? 'Coche la règle pour valider'
                  : `Coche les ${challenge.rules.length} règles pour valider`}
            </button>
            <button
              onClick={() => setFailOpen((v) => !v)}
              className="btn-fail-outline mt-2 w-full rounded-lg py-3 text-sm font-semibold"
            >
              Journée ratée — déclarer l'échec
            </button>

            {failOpen && (
              <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(197,83,63,0.1)', border: '1px solid var(--fail)' }}>
                <label className="mb-1.5 block text-xs" style={{ color: 'var(--text-dim)' }}>
                  Montant à mettre au coffre ({challenge.penaltyMin}–{challenge.penaltyMax} {challenge.currency})
                </label>
                <div className="mb-2 text-center text-xl font-bold" style={{ color: 'var(--vault)' }}>
                  {amount} {challenge.currency}
                </div>
                <input
                  type="range"
                  min={challenge.penaltyMin}
                  max={challenge.penaltyMax}
                  step={challenge.penaltyStep}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mb-3 w-full"
                />
                <label className="mb-1.5 block text-xs" style={{ color: 'var(--text-dim)' }}>
                  Pourquoi (optionnel, pour repérer les patterns) :
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ex: fatiguée, journée chargée..."
                  rows={2}
                  className="card2 mb-3 w-full resize-y rounded-lg p-2 text-sm outline-none"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                <button onClick={handleFail} className="btn-fail-solid w-full rounded-lg py-2.5 text-sm font-semibold">
                  Confirmer — retour Jour 1
                </button>
                <button
                  onClick={() => setFailOpen(false)}
                  className="mt-1.5 w-full rounded-lg py-2 text-sm"
                  style={{ color: 'var(--text-dim)' }}
                >
                  Annuler
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Stat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="card px-2 py-3 text-center">
      <div className="text-xl font-bold" style={{ color: color ?? 'var(--text)' }}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
    </div>
  )
}
