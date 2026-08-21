export function todayISO(): string {
  return toISO(new Date())
}

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function isoWeekday(iso: string): number {
  // 0 = Monday .. 6 = Sunday
  const d = new Date(iso + 'T00:00:00')
  return (d.getDay() + 6) % 7
}

export function formatLong(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function startOfWeekISO(iso: string): string {
  return addDays(iso, -isoWeekday(iso))
}

export function weekDates(iso: string): string[] {
  const start = startOfWeekISO(iso)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
