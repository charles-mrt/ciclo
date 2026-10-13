import { renderCalendar } from '../calendar/render.js'
import {
  getItemsTemplate,
  loadItemsTemplate,
  persistItemsTemplate,
  setItemsTemplate
} from '../persistence/template-store.js'
import { deepClone } from '../shared/clone.js'
import { getElement } from '../shared/dom.js'
import { closeOverlay, openOverlay } from '../shared/ui/overlay.js'
import { showToast } from '../shared/ui/toast.js'
import { renderItemFieldsMarkup, readItemFieldsFromForm } from './item-fields.js'

let isTemplateSaving = false

export async function openTemplateEditor() {
  loadItemsTemplate()
  getElement('templateFields').innerHTML = renderItemFieldsMarkup(getItemsTemplate())
  openOverlay('templateOverlay')
  getElement('templateFields').querySelector('#itemName0')?.focus()
}

export function bindTemplateEditorEvents() {
  getElement('templateBtn').addEventListener('click', openTemplateEditor)

  getElement('templateForm').addEventListener('submit', event => {
    event.preventDefault()
    if (isTemplateSaving) return

    const formElement = event.currentTarget
    const submitButton = formElement.querySelector('button[type="submit"]')
    const previousTemplate = deepClone(getItemsTemplate())

    isTemplateSaving = true
    submitButton.disabled = true
    submitButton.textContent = 'Salvando…'

    try {
      setItemsTemplate(readItemFieldsFromForm(formElement))

      if (!persistItemsTemplate()) {
        setItemsTemplate(previousTemplate)
        showToast('Não foi possível salvar o modelo no navegador.')
        return
      }

      closeOverlay('templateOverlay')
      showToast('Itens padrão salvos com sucesso.')
      renderCalendar()
    } finally {
      isTemplateSaving = false
      submitButton.disabled = false
      submitButton.textContent = 'Salvar padrão'
    }
  })
}
