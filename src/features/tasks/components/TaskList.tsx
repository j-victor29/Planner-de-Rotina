import type { Task } from '@/domain';

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function TaskList(_props: TaskListProps) {
  return <div data-component="TaskList">TaskList</div>;
}
