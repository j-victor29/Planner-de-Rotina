import type { PlanBlock, Task } from '@/domain';

export interface PlanBlockCardProps {
  block: PlanBlock;
  task: Task;
  onSelect: (block: PlanBlock) => void;
}

/** Bloco de tarefa; mostra estado fixado e concluído. Etapa 2. */
export function PlanBlockCard(_props: PlanBlockCardProps) {
  return <div data-component="PlanBlockCard">PlanBlockCard</div>;
}
