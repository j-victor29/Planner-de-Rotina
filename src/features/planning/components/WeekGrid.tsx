import type { FixedCommitment, IsoDate, PlanBlock, Task } from '@/domain';

export interface WeekGridProps {
  weekStart: IsoDate;
  commitments: FixedCommitment[];
  blocks: PlanBlock[];
  tasks: Task[];
  onSelectBlock: (block: PlanBlock) => void;
}

/** RF05 — grade da semana (desktop). Etapa 2. */
export function WeekGrid(_props: WeekGridProps) {
  return <div data-component="WeekGrid">WeekGrid</div>;
}
