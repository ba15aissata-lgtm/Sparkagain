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

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function formatLong(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function last7Days(): string[] {
  const out: string[] = []
  const today = todayISO()
  for (let i = 6; i >= 0; i--) out.push(addDays(today, -i))
  return out
}
