/** Mensagem legível de um erro desconhecido. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'Algo deu errado. Tente novamente.';
}
