import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Etapa 2: implementar a partir do Figma. */
export function EmptyState(_props: EmptyStateProps) {
  return <div data-component="EmptyState">EmptyState</div>;
}
