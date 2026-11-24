import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatDuration, type Task, type TaskProgress } from '@/domain';
import page from '@/features/shared/page.module.css';
import { formatDayMonth, formatDeadline } from '@/utils/format';

interface TaskCardProps {
  task: Task;
  progress: TaskProgress;
  today: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Resumo de uma tarefa com progresso do planejamento. */
export function TaskCard({ task, progress, today, onEdit, onDelete }: TaskCardProps) {
  const total = progress.totalMinutes || 1;
  const plannedPct = Math.min(100, (progress.plannedMinutes / total) * 100);
  const donePct = Math.min(100, (progress.doneMinutes / total) * 100);
  return (
    <div className={page.item}>
      <div className={page.itemMain}>
        <span className={page.itemTitle}>{task.title}</span>
        <span className={page.itemMeta}>
          <PriorityBadge priority={task.priority} />
          <span className={page.metaItem}>
            <Icon name="calendar" size={16} /> {formatDayMonth(task.deadline)} · {formatDeadline(task.deadline, today)}
          </span>
          <span className={page.metaItem}>
            <Icon name="clock" size={16} /> {formatDuration(progress.totalMinutes)}
          </span>
        </span>
        <div
          className={page.progress}
          role="progressbar"
          aria-label={`Planejado para ${task.title}`}
          aria-valuemin={0}
          aria-valuemax={progress.totalMinutes}
          aria-valuenow={progress.plannedMinutes}
          aria-valuetext={`${formatDuration(progress.plannedMinutes)} planejadas de ${formatDuration(progress.totalMinutes)}, ${formatDuration(progress.doneMinutes)} concluídas`}
        >
          <div className={page.progressBar} style={{ width: `${plannedPct}%` }}>
            <div className={page.progressDone} style={{ width: `${plannedPct ? (donePct / plannedPct) * 100 : 0}%` }} />
          </div>
        </div>
        <span className={page.itemMeta}>
          {progress.doneMinutes > 0 && <span>{formatDuration(progress.doneMinutes)} concluídas · </span>}
          <span>{formatDuration(progress.plannedMinutes)} no plano</span>
        </span>
        {progress.missingMinutes > 0 && (
          <span className={page.warningText}>
            <Icon name="alert" size={16} /> Não cabe no prazo: faltam {formatDuration(progress.missingMinutes)}
          </span>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className={page.itemActions}>
          {onEdit && <IconButton icon="edit" label={`Editar ${task.title}`} onClick={onEdit} />}
          {onDelete && <IconButton icon="trash" label={`Excluir ${task.title}`} onClick={onDelete} />}
        </div>
      )}
    </div>
  );
}
