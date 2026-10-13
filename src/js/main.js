import { bindCalendarEvents } from './calendar/interactions.js'
import { renderCalendar } from './calendar/render.js'
import { loadCycleStartDate } from './cycle/cycle-state.js'
import { bindStartCycleEvents } from './cycle/start-cycle.js'
import { bindDayEditorEvents } from './day-editor/day-editor.js'
import { bindTemplateEditorEvents } from './day-editor/template-editor.js'
import {
  enableMemoryFallback,
  openDatabase
} from './persistence/database.js'
import { loadItemsTemplate } from './persistence/template-store.js'
import { registerServiceWorker } from './pwa/register-service-worker.js'
import { bindRestoreDatabaseEvents } from './restore/restore-database.js'
import { bindOverlayEvents } from './shared/ui/overlay.js'
import { showToast } from './shared/ui/toast.js'

function bindFeatureEvents() {
  bindOverlayEvents()
  bindCalendarEvents()
  bindDayEditorEvents()
  bindTemplateEditorEvents()
  bindStartCycleEvents()
  bindRestoreDatabaseEvents()
}

async function initializeApp() {
  loadItemsTemplate()
  loadCycleStartDate()

  try {
    await openDatabase()
  } catch (error) {
    console.error('[ciclo] Não foi possível abrir o IndexedDB:', error)
    enableMemoryFallback()
    showToast('O banco não está disponível. As alterações serão temporárias nesta aba.')
  }

  bindFeatureEvents()
  await renderCalendar()

  registerServiceWorker()
}

initializeApp()
