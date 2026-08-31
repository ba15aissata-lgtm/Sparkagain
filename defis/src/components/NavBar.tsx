import { History as HistoryIcon, ListChecks, ListTodo } from 'lucide-react'

export type Tab = 'today' | 'challenges' | 'history'

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'today', label: "Aujourd'hui", icon: ListChecks },
  { id: 'challenges', label: 'Défis', icon: ListTodo },
  { id: 'history', label: 'Historique', icon: HistoryIcon },
]

export function NavBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t"
      style={{ background: 'rgba(20,17,15,0.92)', borderColor: 'var(--border)', backdropFilter: 'blur(6px)' }}
    >
      <div className="mx-auto flex max-w-xl items-stretch justify-around">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors"
            style={{ color: active === id ? 'var(--accent)' : 'var(--text-dim)' }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
