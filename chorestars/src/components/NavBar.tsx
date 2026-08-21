import { CheckSquare, Gift, History as HistoryIcon, ListChecks, Users } from 'lucide-react'

export type Tab = 'today' | 'chores' | 'kids' | 'rewards' | 'history'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'today', label: 'Today', icon: ListChecks },
  { id: 'chores', label: 'Chores', icon: CheckSquare },
  { id: 'kids', label: 'Kids', icon: Users },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'history', label: 'History', icon: HistoryIcon },
]

export function NavBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90">
      <div className="mx-auto flex max-w-xl items-stretch justify-around">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              active === id
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
            }`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
