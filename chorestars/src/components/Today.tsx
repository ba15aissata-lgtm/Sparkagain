import { useMemo } from 'react'
import { Star } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATEGORY_STYLES, CHORE_CATEGORIES } from '../data/categories'
import { KID_COLOR_STYLES, type KidColorId } from '../data/kidColors'
import { KidAvatar } from './KidAvatar'
import { formatLong, todayISO } from '../lib/date'
import { isDueOn } from '../lib/schedule'
import type { ChoreCategory } from '../types'

export function Today() {
  const allKids = useStore((s) => s.kids)
  const kids = useMemo(() => allKids.filter((k) => !k.archived), [allKids])
  const allChores = useStore((s) => s.chores)
  const chores = useMemo(() => allChores.filter((c) => !c.archived), [allChores])
  const completions = useStore((s) => s.completions)
  const toggleCompletion = useStore((s) => s.toggleCompletion)
  const kidBalance = useStore((s) => s.kidBalance)
  const date = todayISO()

  const isDone = (choreId: string, kidId: string) => !!completions[choreId]?.[kidId]?.[date]

  return (
    <div className="mx-auto max-w-xl px-4 pb-28 pt-6">
      <header className="mb-6">
        <p className="text-sm text-neutral-500">{formatLong(date)}</p>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Today's chores</h1>
      </header>

      {kids.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {kids.map((kid) => {
            const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
            return (
              <div
                key={kid.id}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border ${style.border} ${style.bgSoft} px-3 py-2`}
              >
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

      {kids.length === 0 && (
        <p className="mt-10 text-center text-sm text-neutral-500">
          No one yet. Add a kid — or yourself — in the People tab.
        </p>
      )}

      {kids.map((kid) => {
        const kidChores = chores.filter((c) => c.kidIds.includes(kid.id) && isDueOn(c, date))
        const style = KID_COLOR_STYLES[(kid.color as KidColorId) in KID_COLOR_STYLES ? (kid.color as KidColorId) : 'violet']
        const doneCount = kidChores.filter((c) => isDone(c.id, kid.id)).length

        return (
          <section key={kid.id} className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <KidAvatar kid={kid} size="md" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">{kid.name}</h2>
                {kidChores.length > 0 && (
                  <p className="text-xs text-neutral-500">
                    {doneCount}/{kidChores.length} done
                  </p>
                )}
              </div>
              <span className={`flex items-center gap-1 text-lg font-bold ${style.text}`}>
                <Star size={16} className="fill-current" /> {kidBalance(kid.id)}
              </span>
            </div>

            {kidChores.length === 0 ? (
              <p className="rounded-xl border border-dashed border-black/10 p-4 text-center text-sm text-neutral-400 dark:border-white/10">
                Nothing due today 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {kidChores.map((chore) => {
                  const done = isDone(chore.id, kid.id)
                  const catStyle = CATEGORY_STYLES[chore.category as ChoreCategory]
                  const cat = CHORE_CATEGORIES.find((c) => c.id === chore.category)!
                  return (
                    <button
                      key={chore.id}
                      onClick={() => toggleCompletion(chore.id, kid.id, date)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        done
                          ? `${catStyle.border} ${catStyle.bgSoft}`
                          : 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          done
                            ? `${catStyle.bg} border-transparent text-white`
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {done && (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="text-base leading-none">{cat.emoji}</span>
                      <span
                        className={`flex-1 text-sm font-medium ${
                          done ? 'text-neutral-500 line-through' : 'text-neutral-900 dark:text-white'
                        }`}
                      >
                        {chore.name}
                      </span>
                      <span className={`flex items-center gap-0.5 text-xs font-semibold ${catStyle.text}`}>
                        <Star size={12} className="fill-current" /> {chore.points}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
