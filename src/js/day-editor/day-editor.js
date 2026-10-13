import { renderCalendar } from '../calendar/render.js'
import { parseDateKey } from '../dates/date-keys.js'
import { ensureDayRecord, updateDayRecord } from '../persistence/day-records.js'
import { getItemsTemplate } from '../persistence/template-store.js'
import { getElement } from '../shared/dom.js'
import { getUserFacingErrorMessage } from '../shared/errors.js'
import { closeOverlay, openOverlay } from '../shared/ui/overlay.js'
import { showToast } from '../shared/ui/toast.js'
import { renderItemFieldsMarkup, readItemFieldsFromForm } from './item-fields.js'

let editingDateKey = null
let isEditorSaving = false

export async function openDayEditor(dateKey) {
  try {
    const dayRecord = await ensureDayRecord(dateKey)
    editingDateKey = dateKey

    getElement('editorTitle').textContent =
      `Itens de ${parseDateKey(dateKey).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long'
      })}`

    getElement('editorSubtitle').textContent =
      'Alterar aqui afeta somente esta data e preserva o restante do histórico.'

    getElement('editorFields').innerHTML =
      renderItemFieldsMarkup(dayRecord.items || getItemsTemplate())
    openOverlay('editorOverlay')
    getElement('itemName0').focus()
  } catch (error) {
    showToast(getUserFacingErrorMessage('Erro ao abrir os itens', error))
  }
}

export function bindDayEditorEvents() {
  getElement('editorForm').addEventListener('submit', async event => {
    event.preventDefault()

    if (!editingDateKey || isEditorSaving) return

    const formElement = event.currentTarget
    const dateKey = editingDateKey
    const submitButton = formElement.querySelector('button[type="submit"]')
    const editedItems = readItemFieldsFromForm(formElement)

    isEditorSaving = true
    submitButton.disabled = true
    submitButton.textContent = 'Salvando…'

    try {
      await updateDayRecord(dateKey, record => {
        record.items = editedItems
        return record
      })

      closeOverlay('editorOverlay')
      await renderCalendar()
      showToast('Itens do dia salvos.')
    } catch (error) {
      showToast(getUserFacingErrorMessage('Erro ao salvar os itens', error))
    } finally {
      isEditorSaving = false
      submitButton.disabled = false
      submitButton.textContent = 'Salvar itens'
    }
  })

  getElement('resetToTemplate').addEventListener('click', () => {
    if (!confirm('Substituir os campos deste dia pelos itens padrão? A conclusão do dia será mantida.')) {
      return
    }

    getElement('editorFields').innerHTML = renderItemFieldsMarkup(getItemsTemplate())
  })
}
