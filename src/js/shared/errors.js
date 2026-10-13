export function getUserFacingErrorMessage(operationLabel, error) {
  console.error(`[ciclo] ${operationLabel}:`, error)

  if (error?.name === 'QuotaExceededError') {
    return 'O armazenamento do navegador está cheio.'
  }

  if (error?.name === 'InvalidStateError') {
    return 'A conexão com o banco foi interrompida. Atualize a página e tente novamente.'
  }

  if (error?.name === 'TransactionInactiveError') {
    return 'A operação expirou. Tente novamente.'
  }

  if (error?.name === 'AbortError') {
    return 'A gravação foi cancelada pelo navegador. Tente novamente.'
  }

  return 'Não foi possível concluir a operação. Tente novamente.'
}
