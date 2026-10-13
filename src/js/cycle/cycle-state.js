import { isValidDateKey } from '../dates/date-keys.js'

export const CYCLE_START_STORAGE_KEY = 'ciclo-cycle-start-v1'

let cycleStartDateKey = null

export function getCycleStartDateKey() {
  return cycleStartDateKey
}

export function setCycleStartDateKey(dateKey) {
  cycleStartDateKey = dateKey
}

export function loadCycleStartDate() {
  try {
    const storedDateKey = localStorage.getItem(CYCLE_START_STORAGE_KEY)
    cycleStartDateKey = storedDateKey && isValidDateKey(storedDateKey) ? storedDateKey : null
  } catch (error) {
    console.warn('[ciclo] Não foi possível ler a data inicial:', error)
    cycleStartDateKey = null
  }
}

export function persistCycleStartDate(dateKey) {
  try {
    localStorage.setItem(CYCLE_START_STORAGE_KEY, dateKey)
    cycleStartDateKey = dateKey
    return true
  } catch (error) {
    console.error('[ciclo] Não foi possível salvar a data inicial:', error)
    return false
  }
}

export function clearCycleStartDate() {
  try {
    localStorage.removeItem(CYCLE_START_STORAGE_KEY)
  } catch (error) {
    console.warn('[ciclo] Não foi possível remover a data inicial salva:', error)
  }

  cycleStartDateKey = null
}
