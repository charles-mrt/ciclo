import {
  addDaysToDateKey,
  getDaysBetweenKeys,
  getTodayDateKey,
  isValidDateKey
} from '../dates/date-keys.js'
import { getAllDayRecords } from '../persistence/day-records.js'
import { getElement } from '../shared/dom.js'
import { showToast } from '../shared/ui/toast.js'
import { getCycleStartDateKey } from './cycle-state.js'
import { CYCLE_LENGTH } from './schedule.js'

export function calculateCycleProgress(cycleStartDateKey, allRecords) {
  const totalCycleDays = CYCLE_LENGTH

  if (!cycleStartDateKey || !isValidDateKey(cycleStartDateKey)) {
    return {
      completedDayCount: 0,
      elapsedDays: 0,
      totalCycleDays,
      completionPercentage: 0
    }
  }

  const todayDateKey = getTodayDateKey()
  const elapsedDays = todayDateKey < cycleStartDateKey
    ? 0
    : Math.min(
        totalCycleDays,
        getDaysBetweenKeys(cycleStartDateKey, todayDateKey) + 1
      )

  const recordsByDateKey = new Map(
    allRecords.map(record => [record.date, record])
  )

  let completedDayCount = 0

  for (let dayOffset = 0; dayOffset < elapsedDays; dayOffset++) {
    const dateKey = addDaysToDateKey(cycleStartDateKey, dayOffset)
    const dayRecord = recordsByDateKey.get(dateKey)

    if (dayRecord?.completed === true) completedDayCount++
  }

  const completionPercentage = elapsedDays === 0
    ? 0
    : Math.round((completedDayCount / elapsedDays) * 100)

  return {
    completedDayCount,
    elapsedDays,
    totalCycleDays,
    completionPercentage
  }
}

function renderCycleProgress({
  completedDayCount,
  elapsedDays,
  totalCycleDays,
  completionPercentage
}) {
  const progressCountElement = getElement('progressCount')
  const progressSubElement = getElement('progressSub')
  const progressFillElement = getElement('progressFill')
  const progressPercentElement = getElement('progressPercent')
  const progressTrackElement = getElement('progressTrack')

  progressCountElement.textContent =
    `${completedDayCount} ${completedDayCount === 1 ? 'dia concluído' : 'dias concluídos'}`

  progressSubElement.textContent =
    ` · ${elapsedDays} de ${totalCycleDays} dias decorridos`

  progressFillElement.style.width = `${completionPercentage}%`
  progressPercentElement.textContent = `${completionPercentage}%`
  progressTrackElement.setAttribute('aria-valuenow', String(completionPercentage))
}

export async function updateCycleProgress() {
  const cycleStartDateKey = getCycleStartDateKey()

  if (!cycleStartDateKey || !isValidDateKey(cycleStartDateKey)) {
    renderCycleProgress({
      completedDayCount: 0,
      elapsedDays: 0,
      totalCycleDays: CYCLE_LENGTH,
      completionPercentage: 0
    })
    return
  }

  try {
    const allRecords = await getAllDayRecords()
    const progress = calculateCycleProgress(cycleStartDateKey, allRecords)
    renderCycleProgress(progress)
  } catch (error) {
    console.error('[ciclo] Erro ao calcular o progresso:', error)
    showToast('Não foi possível atualizar o progresso.')
  }
}
