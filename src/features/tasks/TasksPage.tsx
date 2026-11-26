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
import { DemoCta } from '@/features/shared/DemoCta';
import page from '@/features/shared/page.module.css';
import { useNow } from '@/hooks/useNow';

/** RF03 — lista de tarefas com o progresso no plano. */
export function TasksPage() {
  const planner = usePlanner();
  const today = dateOf(useNow());
  const [editing, setEditing] = useState<Task | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const sorted = [...planner.tasks].sort(
    (a, b) => a.deadline.localeCompare(b.deadline) || a.title.localeCompare(b.title),
  );
  const canEdit = !planner.readOnly;

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="O que você precisa entregar. O planner encaixa cada uma nos seus horários livres."
        actions={
          canEdit && (
            <Button icon="plus" onClick={() => setEditing('new')}>
              Nova tarefa
            </Button>
          )
        }
      />

      {!canEdit && (
        <>
          <DemoCta
            title="Quer organizar as suas tarefas?"
            text="Crie sua conta grátis, informe quanto tempo cada trabalho leva e o prazo. O planner distribui tudo na sua semana."
          />
          <h2 className={page.sectionLabel}>Tarefas de exemplo</h2>
        </>
      )}

      {planner.status === 'loading' ? (
        <Spinner />
      ) : sorted.length === 0 ? (
        <div className={page.card}>
          <EmptyState
            icon="list"
            title="Nenhuma tarefa ainda"
            description="Cadastre um trabalho, prova ou projeto com a duração e o prazo."
            action={<Button onClick={() => setEditing('new')}>Cadastrar tarefa</Button>}
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
                onEdit={canEdit ? () => setEditing(task) : undefined}
                onDelete={canEdit ? () => setDeleting(task) : undefined}
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
