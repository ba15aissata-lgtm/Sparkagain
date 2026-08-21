import type { Chore } from '../types'
import { isoWeekday } from './date'

export function isDueOn(chore: Chore, dateISO: string): boolean {
  if (chore.frequency === 'daily') return true
  return chore.weekdays.includes(isoWeekday(dateISO))
}
