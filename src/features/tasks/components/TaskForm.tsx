import type { TaskInput } from '@/domain';

export interface TaskFormProps {
  initialValue?: TaskInput;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

/** Etapa 2: implementar a partir do Figma. */
export function TaskForm(_props: TaskFormProps) {
  return <div data-component="TaskForm">TaskForm</div>;
}
