import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { nowHHMM, todayISO } from '../lib/date'

// Fires a browser Notification when a reminder time is hit and habits are
// still incomplete for the day. Only works while the app is open in a tab —
// there's no backend to deliver push notifications when it's closed.
export function useReminderScheduler() {
  useEffect(() => {
    const check = () => {
      const { reminders, reminderLastFired, markReminderFired, habits, completions } =
        useStore.getState()
      if (!reminders.enabled) return
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

      const hhmm = nowHHMM()
      const today = todayISO()
      if (!reminders.times.includes(hhmm)) return
      if (reminderLastFired[hhmm] === today) return

      markReminderFired(hhmm, today)

      const active = habits.filter((h) => !h.archived)
      const remaining = active.filter((h) => !completions[h.id]?.[today])
      if (remaining.length === 0) return

      const names = remaining.slice(0, 3).map((h) => h.name).join(', ')
      new Notification('Sparkagain', {
        body: `${remaining.length} habit${remaining.length === 1 ? '' : 's'} left today: ${names}${
          remaining.length > 3 ? '…' : ''
        }`,
        icon: '/favicon.svg',
        tag: 'sparkagain-reminder',
      })
    }

    check()
    const id = setInterval(check, 20_000)
    return () => clearInterval(id)
  }, [])
}
