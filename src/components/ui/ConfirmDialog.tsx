export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function ConfirmDialog(_props: ConfirmDialogProps) {
  return <div data-component="ConfirmDialog">ConfirmDialog</div>;
}
