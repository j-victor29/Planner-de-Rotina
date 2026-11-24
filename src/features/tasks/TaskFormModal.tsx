import { TaskForm } from './TaskForm';
import { usePlanner } from '@/app/providers/PlannerContext';
import { Modal } from '@/components/ui/Modal';
import type { Task } from '@/domain';

interface TaskFormModalProps {
  /** Tarefa sendo editada, 'new' para criar, ou null (fechado). */
  editing: Task | 'new' | null;
  onClose: () => void;
}

export function TaskFormModal({ editing, onClose }: TaskFormModalProps) {
  const planner = usePlanner();
  const isNew = editing === 'new';
  return (
    <Modal open={editing !== null} title={isNew ? 'Nova tarefa' : 'Editar tarefa'} onClose={onClose}>
      {editing !== null && (
        <TaskForm
          initialValue={isNew ? undefined : editing}
          submitLabel={isNew ? 'Criar tarefa' : 'Salvar'}
          onCancel={onClose}
          onSubmit={async (input) => {
            const ok = isNew ? await planner.createTask(input) : await planner.updateTask(editing.id, input);
            if (ok) onClose();
            return ok;
          }}
        />
      )}
    </Modal>
  );
}
