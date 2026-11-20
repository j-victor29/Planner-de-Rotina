import type { IsoDate } from '@/domain';

export interface WeekNavigatorProps {
  weekStart: IsoDate;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function WeekNavigator(_props: WeekNavigatorProps) {
  return <div data-component="WeekNavigator">WeekNavigator</div>;
}
