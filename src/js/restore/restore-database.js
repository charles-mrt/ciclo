import { renderCalendar } from '../calendar/render.js'
import { clearCycleStartDate } from '../cycle/cycle-state.js'
import { clearAllDatabaseRecords } from '../persistence/database.js'
import { resetItemsTemplateToDefaults } from '../persistence/template-store.js'
import { getElement } from '../shared/dom.js'
import { getUserFacingErrorMessage } from '../shared/errors.js'
import { closeDayMenus } from '../shared/ui/menus.js'
import { closeOverlay, openOverlay } from '../shared/ui/overlay.js'
import { showToast } from '../shared/ui/toast.js'

export function bindRestoreDatabaseEvents() {
  getElement('restoreDatabaseBtn').addEventListener('click', () => {
    getElement('confirmRestoreDatabase').checked = false
    getElement('confirmRestoreDatabaseBtn').disabled = true
    getElement('confirmRestoreDatabaseBtn').style.opacity = '.55'
    getElement('confirmRestoreDatabaseBtn').style.cursor = 'not-allowed'
    openOverlay('restoreDatabaseOverlay')
  })

  getElement('confirmRestoreDatabase').addEventListener('change', event => {
    const confirmButton = getElement('confirmRestoreDatabaseBtn')
    const isConfirmed = event.target.checked

    confirmButton.disabled = !isConfirmed
    confirmButton.style.opacity = isConfirmed ? '1' : '.55'
    confirmButton.style.cursor = isConfirmed ? 'pointer' : 'not-allowed'
  })

  getElement('confirmRestoreDatabaseBtn').addEventListener('click', async event => {
    const confirmButton = event.currentTarget

    if (!getElement('confirmRestoreDatabase').checked || confirmButton.disabled) return

    confirmButton.disabled = true
    confirmButton.textContent = 'Restaurando…'

    try {
      await clearAllDatabaseRecords()
      resetItemsTemplateToDefaults()
      clearCycleStartDate()

      closeOverlay('restoreDatabaseOverlay')
      closeDayMenus()

      await renderCalendar()
      showToast('Banco restaurado com sucesso.')
    } catch (error) {
      showToast(getUserFacingErrorMessage('Erro ao restaurar o banco', error))
    } finally {
      confirmButton.textContent = 'Restaurar banco'
      confirmButton.disabled = !getElement('confirmRestoreDatabase').checked
      confirmButton.style.opacity = confirmButton.disabled ? '.55' : '1'
      confirmButton.style.cursor = confirmButton.disabled ? 'not-allowed' : 'pointer'
    }
  })
}
