import { useMemo, useState } from 'react';
import { BlockDetailsModal } from './BlockDetailsModal';
import { DayTabs } from './DayTabs';
import { Legend } from './Legend';
import styles from './planning.module.css';
import { PlanSidePanel } from './PlanSidePanel';
import { Timeline } from './Timeline';
import { WeekNavigator } from './WeekNavigator';
import { usePlanner } from '@/app/providers/PlannerContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { addDays, dateOf, formatDuration, minuteOf, startOfWeek, weekDays, type Id, type Task } from '@/domain';
import { TaskFormModal } from '@/features/tasks/TaskFormModal';
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery';
import { useNow } from '@/hooks/useNow';

/** RF04, RF05, RF10 — tela principal: a semana como linha do tempo. */
export function WeekPage() {
  const planner = usePlanner();
  const now = useNow();
  const today = dateOf(now);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedBlockId, setSelectedBlockId] = useState<Id | null>(null);
  const [creating, setCreating] = useState(false);

  const weekStart = startOfWeek(selectedDay);
  const days = weekDays(weekStart);
  const tasksById = useMemo(() => new Map<Id, Task>(planner.tasks.map((t) => [t.id, t])), [planner.tasks]);
  const selectedBlock = planner.blocks.find((b) => b.id === selectedBlockId) ?? null;
  const selectedTask = selectedBlock ? (tasksById.get(selectedBlock.taskId) ?? null) : null;

  const newTask = () => {
    if (planner.ensureAccess()) setCreating(true);
  };

  return (
    <>
      <PageHeader
        title="Sua semana"
        description="O planner encaixa suas tarefas nos horários livres, até o prazo de cada uma."
        actions={
          <Button icon="plus" onClick={newTask}>
            Nova tarefa
          </Button>
        }
      />

      {planner.alerts.length > 0 && (
        <div className={styles.alerts}>
          {planner.alerts.map((alert) => (
            <Alert key={alert.taskId} tone="warning" title={`${tasksById.get(alert.taskId)?.title ?? 'Tarefa'} não cabe no prazo`}>
              Faltam {formatDuration(alert.missingMinutes)} de tempo livre até a entrega. Aumente o limite diário,
              libere horários ou ajuste o prazo.
            </Alert>
          ))}
        </div>
      )}

      <div className={styles.toolbar}>
        <WeekNavigator
          weekStart={weekStart}
          isCurrentWeek={weekStart === startOfWeek(today)}
          onPrevious={() => setSelectedDay(addDays(selectedDay, -7))}
          onNext={() => setSelectedDay(addDays(selectedDay, 7))}
          onToday={() => setSelectedDay(today)}
        />
        {isDesktop && <Legend />}
      </div>

      {!isDesktop && (
        <DayTabs days={days} selected={selectedDay} today={today} blocks={planner.blocks} onSelect={setSelectedDay} />
      )}

      {planner.status === 'loading' ? (
        <Spinner label="Montando seu plano" />
      ) : (
        <div className={styles.layout}>
          <Timeline
            days={isDesktop ? days : [selectedDay]}
            today={today}
            nowMinute={minuteOf(now)}
            commitments={planner.commitments}
            blocks={planner.blocks}
            tasksById={tasksById}
            settings={planner.settings}
            onSelectBlock={(b) => setSelectedBlockId(b.id)}
          />
          <PlanSidePanel tasks={planner.tasks} blocks={planner.blocks} alerts={planner.alerts} today={today} />
        </div>
      )}

      <BlockDetailsModal
        block={selectedBlock}
        task={selectedTask}
        today={today}
        onClose={() => setSelectedBlockId(null)}
      />
      <TaskFormModal editing={creating ? 'new' : null} onClose={() => setCreating(false)} />
    </>
  );
}
