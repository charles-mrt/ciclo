import { renderCalendar } from '../calendar/render.js'
import { setViewedMonth } from '../calendar/view-state.js'
import {
  addDaysToDateKey,
  getTodayDateKey,
  isValidDateKey,
  parseDateKey
} from '../dates/date-keys.js'
import { getAllDayRecords, updateDayRecord } from '../persistence/day-records.js'
import { deepClone } from '../shared/clone.js'
import { getElement } from '../shared/dom.js'
import { getUserFacingErrorMessage } from '../shared/errors.js'
import { closeOverlay, openOverlay } from '../shared/ui/overlay.js'
import { showToast } from '../shared/ui/toast.js'
import {
  getCycleStartDateKey,
  loadCycleStartDate,
  persistCycleStartDate
} from './cycle-state.js'
import {
  buildCycleItemsForDoseDay,
  CYCLE_DOSE_SCHEDULE
} from './schedule.js'

export async function fillCycleFromStartDate(startDateKey) {
  if (!isValidDateKey(startDateKey)) {
    showToast('Selecione uma data inicial válida.')
    return
  }

  const cycleDateKeys = CYCLE_DOSE_SCHEDULE.map((_, dayOffset) =>
    addDaysToDateKey(startDateKey, dayOffset)
  )

  let existingRecords

  try {
    existingRecords = await getAllDayRecords()
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao verificar os registros existentes', error))
    return
  }

  const existingRecordsByDate = new Map(existingRecords.map(record => [record.date, record]))
  const overlappingDateKeys = cycleDateKeys.filter(dateKey => existingRecordsByDate.has(dateKey))

  if (overlappingDateKeys.length > 0) {
    const confirmed = confirm(
      `Existem ${overlappingDateKeys.length} dia(s) com registros salvos no período escolhido.\n\n` +
      'Se continuar, os itens dessas datas serão substituídos pela sequência do ciclo. ' +
      'As conclusões dos dias serão preservadas.\n\nDeseja continuar?'
    )

    if (!confirmed) return
  }

  const confirmButton = getElement('confirmStartCycleBtn')
  confirmButton.disabled = true
  confirmButton.textContent = 'Preenchendo…'

  try {
    for (let dayOffset = 0; dayOffset < CYCLE_DOSE_SCHEDULE.length; dayOffset++) {
      const dateKey = cycleDateKeys[dayOffset]
      const cycleItems = buildCycleItemsForDoseDay(CYCLE_DOSE_SCHEDULE[dayOffset])

      await updateDayRecord(dateKey, record => {
        record.items = deepClone(cycleItems)
        return record
      })
    }

    const didPersistStartDate = persistCycleStartDate(startDateKey)
    closeOverlay('startCycleOverlay')

    const startDate = parseDateKey(startDateKey)
    setViewedMonth(startDate.getFullYear(), startDate.getMonth())

    await renderCalendar()

    showToast(didPersistStartDate
      ? 'Ciclo iniciado: os 29 dias foram preenchidos.'
      : 'Ciclo preenchido, mas não foi possível guardar a data inicial.')
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao preencher o ciclo', error))
    await renderCalendar()
  } finally {
    confirmButton.disabled = false
    confirmButton.textContent = 'Preencher calendário'
  }
}

export function bindStartCycleEvents() {
  getElement('startCycleBtn').addEventListener('click', () => {
    loadCycleStartDate()
    getElement('cycleStartDate').value = getCycleStartDateKey() || getTodayDateKey()
    openOverlay('startCycleOverlay')
  })

  getElement('startCycleForm').addEventListener('submit', async event => {
    event.preventDefault()
    await fillCycleFromStartDate(getElement('cycleStartDate').value)
  })
}
