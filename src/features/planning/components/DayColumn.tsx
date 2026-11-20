import type { FixedCommitment, IsoDate, PlanBlock, Task } from '@/domain';

export interface DayColumnProps {
  day: IsoDate;
  commitments: FixedCommitment[];
  blocks: PlanBlock[];
  tasks: Task[];
  onSelectBlock: (block: PlanBlock) => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function DayColumn(_props: DayColumnProps) {
  return <div data-component="DayColumn">DayColumn</div>;
}
