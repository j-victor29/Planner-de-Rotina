import { useState } from 'react';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from './TaskFormModal';
import { usePlanner } from '@/app/providers/PlannerContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { dateOf, taskProgress, type Task } from '@/domain';
import page from '@/features/shared/page.module.css';
import { useNow } from '@/hooks/useNow';

/** RF03 — lista de tarefas com o progresso no plano. */
export function TasksPage() {
  const planner = usePlanner();
  const today = dateOf(useNow());
  const [editing, setEditing] = useState<Task | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const open = (value: Task | 'new') => {
    if (planner.ensureAccess()) setEditing(value);
  };
  const sorted = [...planner.tasks].sort(
    (a, b) => a.deadline.localeCompare(b.deadline) || a.title.localeCompare(b.title),
  );

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="O que você precisa entregar. O planner encaixa cada uma nos seus horários livres."
        actions={
          <Button icon="plus" onClick={() => open('new')}>
            Nova tarefa
          </Button>
        }
      />

      {planner.status === 'loading' ? (
        <Spinner />
      ) : sorted.length === 0 ? (
        <div className={page.card}>
          <EmptyState
            icon="list"
            title="Nenhuma tarefa ainda"
            description="Cadastre um trabalho, prova ou projeto com a duração e o prazo."
            action={<Button onClick={() => open('new')}>Cadastrar tarefa</Button>}
          />
        </div>
      ) : (
        <ul className={`${page.list} ${page.listGrid}`}>
          {sorted.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                today={today}
                progress={taskProgress(task, planner.blocks, planner.alerts)}
                onEdit={() => open(task)}
                onDelete={() => planner.ensureAccess() && setDeleting(task)}
              />
            </li>
          ))}
        </ul>
      )}

      <TaskFormModal editing={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Excluir tarefa?"
        message={`"${deleting?.title ?? ''}" e todos os blocos dela serão removidos do plano.`}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await planner.deleteTask(deleting.id);
          setDeleting(null);
        }}
      />
    </>
  );
}
