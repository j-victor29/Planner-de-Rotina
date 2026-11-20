import type { IsoDateTime, PlanBlock, Task } from '@/domain';

export interface BlockDetailsModalProps {
  block: PlanBlock | null;
  task: Task | null;
  onClose: () => void;
  onMove: (block: PlanBlock, newStart: IsoDateTime) => Promise<void>;
  onTogglePin: (block: PlanBlock) => Promise<void>;
  onToggleDone: (block: PlanBlock) => Promise<void>;
}

/** RF06, RF07, RF08 — mover, fixar e concluir bloco. Etapa 2. */
export function BlockDetailsModal(_props: BlockDetailsModalProps) {
  return <div data-component="BlockDetailsModal">BlockDetailsModal</div>;
}
