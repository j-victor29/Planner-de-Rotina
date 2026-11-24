import styles from './planning.module.css';
import { Icon } from '@/components/ui/Icon';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { formatDuration, taskProgress, type PlanAlert, type PlanBlock, type Task } from '@/domain';
import { formatDeadline } from '@/utils/format';

interface PlanSidePanelProps {
  tasks: Task[];
  blocks: PlanBlock[];
  alerts: PlanAlert[];
  today: string;
}

/** Resumo ao lado da linha do tempo: alertas (RF10) e progresso das tarefas. */
export function PlanSidePanel({ tasks, blocks, alerts, today }: PlanSidePanelProps) {
  const sorted = [...tasks].sort((a, b) => a.deadline.localeCompare(b.deadline));
  return (
    <aside className={styles.side} aria-label="Resumo das tarefas">
      <h2 className={styles.sideTitle}>Tarefas</h2>
      {sorted.length === 0 && <p className={styles.sideEmpty}>Nenhuma tarefa cadastrada.</p>}
      <ul className={styles.sideList}>
        {sorted.map((task) => {
          const p = taskProgress(task, blocks, alerts);
          const pct = Math.min(100, (p.plannedMinutes / (p.totalMinutes || 1)) * 100);
          return (
            <li key={task.id} className={styles.sideItem}>
              <div className={styles.sideItemTop}>
                <span className={styles.sideItemTitle}>{task.title}</span>
                <PriorityBadge priority={task.priority} />
              </div>
              <div className={styles.sideBar} aria-hidden="true">
                <span style={{ width: `${pct}%` }} />
              </div>
              <span className={styles.sideItemMeta}>
                {formatDuration(p.plannedMinutes)} de {formatDuration(p.totalMinutes)} · {formatDeadline(task.deadline, today)}
              </span>
              {p.missingMinutes > 0 && (
                <span className={styles.sideWarning}>
                  <Icon name="alert" size={14} /> faltam {formatDuration(p.missingMinutes)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
