import type { ReactNode } from 'react';

export interface AlertProps {
  tone: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
}

/** Etapa 2: implementar a partir do Figma. */
export function Alert(_props: AlertProps) {
  return <div data-component="Alert">Alert</div>;
}
