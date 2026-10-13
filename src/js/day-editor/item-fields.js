import { escapeHtml } from '../shared/html.js'
import { normalizeItem } from '../shared/items.js'

export function renderItemFieldsMarkup(items) {
  return [0, 1, 2].map(itemIndex => `
    <div class="item-editor">
      <div class="item-editor-head">Item ${itemIndex + 1}</div>
      <div class="field-grid">
        <div class="field">
          <label for="itemName${itemIndex}">Nome</label>
          <input id="itemName${itemIndex}" name="name${itemIndex}" maxlength="50"
            value="${escapeHtml(items[itemIndex]?.name || '')}"
            placeholder="Ex.: Whey" required>
        </div>
        <div class="field">
          <label for="itemQuantity${itemIndex}">Quantidade</label>
          <input id="itemQuantity${itemIndex}" name="quantity${itemIndex}" maxlength="50"
            value="${escapeHtml(items[itemIndex]?.quantity || '')}"
            placeholder="Ex.: 2 gotas">
        </div>
      </div>
      <div class="field" style="margin-top:9px;margin-bottom:0">
        <label for="itemInstruction${itemIndex}">Instrução complementar (opcional)</label>
        <input id="itemInstruction${itemIndex}" name="instruction${itemIndex}" maxlength="80"
          value="${escapeHtml(items[itemIndex]?.instruction || '')}"
          placeholder="Ex.: em jejum">
      </div>
    </div>
  `).join('')
}

export function readItemFieldsFromForm(formElement) {
  return [0, 1, 2].map(itemIndex => normalizeItem({
    name: formElement.elements[`name${itemIndex}`].value,
    quantity: formElement.elements[`quantity${itemIndex}`].value,
    instruction: formElement.elements[`instruction${itemIndex}`].value
  }))
}
