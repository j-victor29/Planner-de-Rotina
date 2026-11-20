import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

/** Etapa 2: implementar a partir do Figma. */
export function PageHeader(_props: PageHeaderProps) {
  return <div data-component="PageHeader">PageHeader</div>;
}
