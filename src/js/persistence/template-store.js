import { deepClone } from '../shared/clone.js'
import { normalizeItem } from '../shared/items.js'

const TEMPLATE_STORAGE_KEY = 'ciclo-template-v1'

export const INITIAL_ITEMS_TEMPLATE = [
  { name: 'Cravinho', quantity: '', instruction: '' },
  { name: 'Artemisia', quantity: '', instruction: '' },
  { name: 'Nogueira', quantity: '', instruction: '' }
]

let itemsTemplate = INITIAL_ITEMS_TEMPLATE.map(item => ({ ...item }))

export function getItemsTemplate() {
  return itemsTemplate
}

export function setItemsTemplate(nextTemplate) {
  itemsTemplate = nextTemplate
}

export function loadItemsTemplate() {
  try {
    const storedTemplate = localStorage.getItem(TEMPLATE_STORAGE_KEY)

    if (storedTemplate) {
      const parsedTemplate = JSON.parse(storedTemplate)

      if (Array.isArray(parsedTemplate) && parsedTemplate.length === 3) {
        itemsTemplate = parsedTemplate.map(normalizeItem)
      }
    }
  } catch (error) {
    console.warn('[ciclo] Não foi possível ler o modelo salvo:', error)
  }
}

export function persistItemsTemplate() {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(itemsTemplate))
    return true
  } catch (error) {
    console.error('[ciclo] Falha ao salvar o modelo:', error)
    return false
  }
}

export function resetItemsTemplateToDefaults() {
  itemsTemplate = INITIAL_ITEMS_TEMPLATE.map(item => ({ ...item }))

  if (!persistItemsTemplate()) {
    throw new Error('Não foi possível restaurar os itens padrão.')
  }
}

export function createDefaultDayRecord(dateKey) {
  return {
    date: dateKey,
    completed: false,
    items: deepClone(itemsTemplate),
    updatedAt: new Date().toISOString()
  }
}
