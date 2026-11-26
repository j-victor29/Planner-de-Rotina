import { useState, type FormEvent } from 'react';
import styles from './planning.module.css';
import { usePlanner } from '@/app/providers/PlannerContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TextField } from '@/components/ui/TextField';
import { TimeField } from '@/components/ui/TimeField';
import { formatDuration, parseClock, type IsoDate, type PlanBlock, type Task } from '@/domain';
import { clockText, formatDayMonth, formatShortDate, formatTimeRange } from '@/utils/format';

interface BlockDetailsModalProps {
  block: PlanBlock | null;
  task: Task | null;
  today: IsoDate;
  onClose: () => void;
}

/** RF06, RF07, RF08 — detalhes do bloco: mover, fixar e concluir. */
export function BlockDetailsModal({ block, task, today, onClose }: BlockDetailsModalProps) {
  const open = block !== null && task !== null;
  return (
    <Modal open={open} title={task?.title ?? ''} onClose={onClose}>
      {open && <BlockDetails key={block.id} block={block} task={task} today={today} onClose={onClose} />}
    </Modal>
  );
}

function BlockDetails({ block, task, today, onClose }: { block: PlanBlock; task: Task; today: IsoDate; onClose: () => void }) {
  const planner = usePlanner();
  const duration = block.end - block.start;
  const [date, setDate] = useState(block.date);
  const [start, setStart] = useState(clockText(block.start));
  const [moveError, setMoveError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'pin' | 'done' | 'move' | null>(null);

  async function act(kind: 'pin' | 'done', run: () => Promise<boolean>) {
    setBusy(kind);
    const ok = await run();
    setBusy(null);
    if (ok) onClose();
  }

  async function move(event: FormEvent) {
    event.preventDefault();
    const parsed = parseClock(start);
    if (!parsed.ok) {
      setMoveError(parsed.error);
      return;
    }
    setBusy('move');
    const error = await planner.moveBlock(block.id, date, parsed.minutes);
    setBusy(null);
    if (error) setMoveError(error);
    else onClose();
  }

  return (
    <div className={styles.details}>
      <div className={styles.detailsMeta}>
        <PriorityBadge priority={task.priority} />
        {block.pinned && <span className={styles.statusChip}>Fixado</span>}
        {block.done && <span className={styles.statusChipDone}>Concluído</span>}
      </div>
      <dl className={styles.detailsList}>
        <div>
          <dt>Quando</dt>
          <dd>
            {formatShortDate(block.date)} · {formatTimeRange(block.start, block.end)} ({formatDuration(duration)})
          </dd>
        </div>
        <div>
          <dt>Prazo da tarefa</dt>
          <dd>{formatDayMonth(task.deadline)}</dd>
        </div>
      </dl>

      <div className={styles.detailsActions}>
        <Button
          variant="secondary"
          icon={block.pinned ? 'unlock' : 'lock'}
          loading={busy === 'pin'}
          onClick={() => act('pin', () => planner.setPinned(block.id, !block.pinned))}
        >
          {block.pinned ? 'Desfixar' : 'Fixar horário'}
        </Button>
        <Button
          variant={block.done ? 'secondary' : 'primary'}
          icon="check"
          loading={busy === 'done'}
          onClick={() => act('done', () => planner.setDone(block.id, !block.done))}
        >
          {block.done ? 'Desmarcar concluído' : 'Marcar como concluído'}
        </Button>
      </div>
      <p className={styles.detailsHint}>
        Blocos fixados ou concluídos não mudam quando o plano é recalculado.
      </p>

      <form className={styles.moveForm} onSubmit={move} noValidate>
        <h3 className={styles.moveTitle}>Mover bloco</h3>
        {moveError && <Alert tone="error">{moveError}</Alert>}
        <div className={styles.moveRow}>
          <TextField label="Dia" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
          <TimeField label="Começa às" value={start} onChange={setStart} />
        </div>
        <Button type="submit" variant="secondary" icon="move" loading={busy === 'move'}>
          Mover para este horário
        </Button>
      </form>
    </div>
  );
}
