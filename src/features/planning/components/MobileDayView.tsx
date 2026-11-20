import type { FixedCommitment, IsoDate, PlanBlock, Task } from '@/domain';

export interface MobileDayViewProps {
  day: IsoDate;
  commitments: FixedCommitment[];
  blocks: PlanBlock[];
  tasks: Task[];
  onChangeDay: (day: IsoDate) => void;
  onSelectBlock: (block: PlanBlock) => void;
}

/** RF05 — visão de um dia por vez (celular). Etapa 2. */
export function MobileDayView(_props: MobileDayViewProps) {
  return <div data-component="MobileDayView">MobileDayView</div>;
}
