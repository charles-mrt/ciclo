export const formatDateKey = (year, monthIndex, day) =>
  `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

export function getTodayDateKey() {
  const now = new Date()
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate())
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function isValidDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || '')) return false

  const date = parseDateKey(dateKey)

  return Number.isFinite(date.getTime()) &&
    formatDateKey(date.getFullYear(), date.getMonth(), date.getDate()) === dateKey
}

export function addDaysToDateKey(dateKey, dayCount) {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + dayCount)
  return formatDateKey(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getDaysBetweenKeys(fromDateKey, toDateKey) {
  const [fromYear, fromMonth, fromDay] = fromDateKey.split('-').map(Number)
  const [toYear, toMonth, toDay] = toDateKey.split('-').map(Number)

  return Math.round((
    Date.UTC(toYear, toMonth - 1, toDay) -
    Date.UTC(fromYear, fromMonth - 1, fromDay)
  ) / 86400000)
}

export function isFutureDateKey(dateKey) {
  return dateKey > getTodayDateKey()
}

export function formatMonthTitle(year, monthIndex) {
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(year, monthIndex, 1, 12))
}

export function formatShortWeekday(date) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
    .format(date).replace('.', '')
}
