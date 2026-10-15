import { formatDateKey, formatMonthTitle } from '../dates/date-keys.js'
import { updateCycleProgress } from '../cycle/progress.js'
import { getMonthDayRecords } from '../persistence/day-records.js'
import { isUsingMemoryFallback } from '../persistence/database.js'
import { getItemsTemplate } from '../persistence/template-store.js'
import { deepClone } from '../shared/clone.js'
import { getElement } from '../shared/dom.js'
import { renderDayMarkup } from './day-markup.js'
import { getViewedMonth, getViewedYear } from './view-state.js'

let calendarRenderToken = 0

export async function renderCalendar() {
  const activeRenderToken = ++calendarRenderToken
  const year = getViewedYear()
  const monthIndex = getViewedMonth()

  getElement('monthTitle').textContent = formatMonthTitle(year, monthIndex)
  getElement('calendarGrid').innerHTML = '<div class="loading">Atualizando calendário…</div>'

  try {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const firstWeekdayOffset = new Date(year, monthIndex, 1).getDay()
    const monthRecords = await getMonthDayRecords(year, monthIndex)
console.log(
  '[ciclo] Registros não realizados:',
  [...monthRecords.values()].filter(record => record.notCompleted)
)
    if (activeRenderToken !== calendarRenderToken) return

    const dayMarkupFragments = []

    for (let emptyCellIndex = 0; emptyCellIndex < firstWeekdayOffset; emptyCellIndex++) {
      dayMarkupFragments.push('<div class="day empty-day" aria-hidden="true"></div>')
    }

    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const dateKey = formatDateKey(year, monthIndex, dayOfMonth)
      const dayRecord = monthRecords.get(dateKey) || {
        date: dateKey,
        completed: false,
        notCompleted: false,
        items: deepClone(getItemsTemplate()),
        updatedAt: null
      }

      dayMarkupFragments.push(renderDayMarkup(dayRecord))
    }

    getElement('calendarGrid').innerHTML = dayMarkupFragments.join('')
    await updateCycleProgress()

    getElement('saveStatus').textContent = isUsingMemoryFallback()
      ? 'Modo temporário: não feche esta aba'
      : 'Salvo neste dispositivo'
  } catch (error) {
    if (activeRenderToken !== calendarRenderToken) return

    console.error('[ciclo] Falha ao carregar o calendário:', error)

    getElement('calendarGrid').innerHTML = `
      <div class="empty-note">
        Não foi possível carregar o calendário.
        Verifique o armazenamento do navegador e tente novamente.
      </div>`

    getElement('saveStatus').textContent = 'Falha ao carregar dados'
  }
}
