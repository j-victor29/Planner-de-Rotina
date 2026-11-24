import { blockMinutes } from './schedule';
import { roundUpToSlot } from './time';
import type { Id, PlanAlert, PlanBlock, Task } from './types';

export interface TaskProgress {
  taskId: Id;
  totalMinutes: number;
  plannedMinutes: number;
  doneMinutes: number;
  missingMinutes: number;
}

/** Resumo de uma tarefa: quanto já foi planejado, concluído e quanto não coube. */
export function taskProgress(task: Task, blocks: PlanBlock[], alerts: PlanAlert[]): TaskProgress {
  const own = blocks.filter((b) => b.taskId === task.id);
  return {
    taskId: task.id,
    totalMinutes: roundUpToSlot(task.durationMinutes),
    plannedMinutes: own.reduce((sum, b) => sum + blockMinutes(b), 0),
    doneMinutes: own.filter((b) => b.done).reduce((sum, b) => sum + blockMinutes(b), 0),
    missingMinutes: alerts.find((a) => a.taskId === task.id)?.missingMinutes ?? 0,
  };
}
