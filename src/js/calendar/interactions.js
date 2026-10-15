import { openDayEditor } from '../day-editor/day-editor.js'
import { getElement } from '../shared/dom.js'
import {
  closeDayMenus,
  toggleDayMenu
} from '../shared/ui/menus.js'
import {
  clearDayCompletion,
  promptCopyItemsFromDay,
  toggleDayCompletion,
  markDayAsNotCompleted
} from './day-actions.js'
import { renderCalendar } from './render.js'
import {
  goToCurrentMonth,
  goToNextMonth,
  goToPreviousMonth
} from './view-state.js'

export function bindCalendarEvents() {
  getElement('prevMonth').addEventListener('click', () => {
    goToPreviousMonth()
    renderCalendar()
  })

  getElement('nextMonth').addEventListener('click', () => {
    goToNextMonth()
    renderCalendar()
  })

  getElement('currentMonth').addEventListener('click', () => {
    goToCurrentMonth()
    renderCalendar()
  })

  getElement('fullscreenBtn').addEventListener('click', () => {
    const isFullscreen = document.body.classList.toggle('fullscreen-mode')

    getElement('fullscreenBtn').setAttribute(
      'title',
      isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia'
    )
    getElement('fullscreenBtn').setAttribute(
      'aria-label',
      isFullscreen ? 'Sair da tela cheia' : 'Ativar tela cheia'
    )
  })

  window.addEventListener('keydown', event => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      event.target.matches('.day[data-date]')
    ) {
      event.preventDefault()
      event.stopPropagation()
      toggleDayCompletion(event.target.getAttribute('data-date'))
    }
  })

  getElement('calendarGrid').addEventListener('click', event => {
    const menuButton = event.target.closest('[data-menu]')

    if (menuButton) {
      event.stopPropagation()
      toggleDayMenu(menuButton)
      return

    }

    const actionButton = event.target.closest('[data-action]')

    if (actionButton) {
      event.stopPropagation()

      if (actionButton.disabled) return

      closeDayMenus()

      const actionName = actionButton.getAttribute('data-action')
      const dateKey = actionButton.getAttribute('data-date')

      if (actionName === 'toggle') toggleDayCompletion(dateKey)
      else if (actionName === 'mark-not-completed') markDayAsNotCompleted(dateKey)
      else if (actionName === 'edit') openDayEditor(dateKey)
      else if (actionName === 'copy') promptCopyItemsFromDay(dateKey)
      else if (actionName === 'clear') clearDayCompletion(dateKey)

      return
    }

    const dayElement = event.target.closest('.day[data-date]')

    if (
      dayElement &&
      !event.target.closest('.day-menu') &&
      !event.target.closest('.menu-pop')
    ) {
      toggleDayCompletion(dayElement.getAttribute('data-date'))
    }
  })

  document.addEventListener('click', event => {
    if (!event.target.closest('.day-menu') && !event.target.closest('.menu-pop')) {
      closeDayMenus()
    }
  })
}
