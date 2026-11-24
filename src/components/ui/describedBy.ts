/** Id do texto de ajuda ou de erro ligado a um campo (aria-describedby). */
export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}
