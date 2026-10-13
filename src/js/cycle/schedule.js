import { getDaysBetweenKeys } from '../dates/date-keys.js'

export const CYCLE_DOSE_SCHEDULE = [
  { cravinho: 5, artemisia: 3, nogueira: 5 },
  { cravinho: 5, artemisia: 3, nogueira: 5 },
  { cravinho: 5, artemisia: 4, nogueira: 5 },
  { cravinho: 5, artemisia: 4, nogueira: 5 },
  { cravinho: 5, artemisia: 5, nogueira: null },
  { cravinho: 5, artemisia: 5, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: 10 },
  { cravinho: 10, artemisia: 5, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 5, artemisia: 3, nogueira: null },
  { cravinho: 10, artemisia: 3, nogueira: 10 },
  { cravinho: 10, artemisia: 4, nogueira: 10 },
  { cravinho: 10, artemisia: 4, nogueira: 10 },
  { cravinho: 10, artemisia: 4, nogueira: 10 },
  { cravinho: 10, artemisia: 5, nogueira: null },
  { cravinho: 10, artemisia: 5, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 10, artemisia: 5, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 6, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null },
  { cravinho: 10, artemisia: 7, nogueira: null }
]

export const CYCLE_LENGTH = CYCLE_DOSE_SCHEDULE.length

export function buildCycleItemsForDoseDay(doseDay) {
  const formatDropQuantity = dropCount => dropCount === null ? '' : `${dropCount} gotas`

  return [
    { name: 'Cravinho', quantity: formatDropQuantity(doseDay.cravinho), instruction: '' },
    { name: 'Artemisia', quantity: formatDropQuantity(doseDay.artemisia), instruction: '' },
    {
      name: 'Nogueira',
      quantity: formatDropQuantity(doseDay.nogueira),
      instruction: doseDay.nogueira === null ? 'Nada' : ''
    }
  ]
}

export function getCycleDayFlags(cycleStartDateKey, dateKey) {
  if (!cycleStartDateKey) {
    return {
      cycleDayIndex: -1,
      isOutsideCycle: false,
      isCycleStart: false,
      isCycleEnd: false
    }
  }

  const cycleDayIndex = getDaysBetweenKeys(cycleStartDateKey, dateKey)

  return {
    cycleDayIndex,
    isOutsideCycle: cycleDayIndex < 0 || cycleDayIndex >= CYCLE_LENGTH,
    isCycleStart: cycleDayIndex === 0,
    isCycleEnd: cycleDayIndex === CYCLE_LENGTH - 1
  }
}

export function isDateKeyInCycle(cycleStartDateKey, dateKey) {
  if (!cycleStartDateKey) return false
  const cycleDayIndex = getDaysBetweenKeys(cycleStartDateKey, dateKey)
  return cycleDayIndex >= 0 && cycleDayIndex < CYCLE_LENGTH
}
