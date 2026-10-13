export function normalizeItem(item) {
  return {
    name: String(item?.name ?? '').trim() || 'Nada',
    quantity: String(item?.quantity ?? '').trim(),
    instruction: String(item?.instruction ?? '').trim()
  }
}
