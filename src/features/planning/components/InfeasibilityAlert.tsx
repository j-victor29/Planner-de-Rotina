import type { PlanAlert, Task } from '@/domain';

export interface InfeasibilityAlertProps {
  alerts: PlanAlert[];
  tasks: Task[];
}

/** RF10 — avisa quais tarefas não couberam no prazo. Etapa 2. */
export function InfeasibilityAlert(_props: InfeasibilityAlertProps) {
  return <div data-component="InfeasibilityAlert">InfeasibilityAlert</div>;
}
