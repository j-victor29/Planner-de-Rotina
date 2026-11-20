import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Etapa 2: implementar a partir do Figma. */
export function Modal(_props: ModalProps) {
  return <div data-component="Modal">Modal</div>;
}
