import { useState } from 'react'
import { Bell, BellOff, Plus, X } from 'lucide-react'
import { useStore } from '../store/useStore'

const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window

export function RemindersCard() {
  const reminders = useStore((s) => s.reminders)
  const setRemindersEnabled = useStore((s) => s.setRemindersEnabled)
  const addReminderTime = useStore((s) => s.addReminderTime)
  const removeReminderTime = useStore((s) => s.removeReminderTime)

  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationsSupported ? Notification.permission : 'unsupported'
  )
  const [newTime, setNewTime] = useState('08:00')

  async function requestPermission() {
    if (!notificationsSupported) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }

  function toggleEnabled() {
    if (!reminders.enabled && permission !== 'granted') {
      requestPermission().then(() => setRemindersEnabled(true))
      return
    }
    setRemindersEnabled(!reminders.enabled)
  }

  return (
    <div className="mb-6 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white">
          {reminders.enabled ? <Bell size={15} /> : <BellOff size={15} />} Daily reminders
        </h2>
        <button
          onClick={toggleEnabled}
          role="switch"
          aria-checked={reminders.enabled}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            reminders.enabled ? 'bg-violet-500' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              reminders.enabled ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
      <p className="mb-3 text-xs text-neutral-500">
        Get a notification for any habits still left to do. Only fires while Sparkagain is open
        in a browser tab.
      </p>

      {permission === 'unsupported' && (
        <p className="mb-3 rounded-lg bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
          This browser doesn't support notifications.
        </p>
      )}
      {permission === 'denied' && (
        <p className="mb-3 rounded-lg bg-red-500/10 p-2 text-xs text-red-600 dark:text-red-400">
          Notifications are blocked. Enable them for this site in your browser settings.
        </p>
      )}
      {permission === 'default' && (
        <button
          onClick={requestPermission}
          className="mb-3 w-full rounded-lg border border-violet-500 py-2 text-xs font-semibold text-violet-600 dark:text-violet-400"
        >
          Allow browser notifications
        </button>
      )}

      <div className="mb-2 flex flex-wrap gap-1.5">
        {reminders.times.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 rounded-full bg-violet-500/10 py-1 pl-2.5 pr-1.5 text-xs font-medium text-violet-700 dark:text-violet-300"
          >
            {t}
            <button
              onClick={() => removeReminderTime(t)}
              className="rounded-full p-0.5 hover:bg-violet-500/20"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {reminders.times.length === 0 && (
          <span className="text-xs text-neutral-400">No reminder times set.</span>
        )}
      </div>

      <div className="flex gap-1.5">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent p-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-700"
        />
        <button
          onClick={() => addReminderTime(newTime)}
          className="flex items-center gap-1 rounded-lg bg-violet-500 px-3 text-sm font-semibold text-white"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  )
}
