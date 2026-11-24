import styles from './planning.module.css';
import { PX_PER_MINUTE } from './timelineScale';
import { Icon } from '@/components/ui/Icon';
import { formatDuration, type PlanBlock, type Task } from '@/domain';
import { cx } from '@/utils/cx';
import { formatTimeRange, PRIORITY_LABEL } from '@/utils/format';

interface TimelineBlockProps {
  block: PlanBlock;
  task: Task;
  rangeStart: number;
  onSelect: (block: PlanBlock) => void;
}

/** Bloco de tarefa na linha do tempo. Cor = prioridade; ícones = fixado/concluído. */
export function TimelineBlock({ block, task, rangeStart, onSelect }: TimelineBlockProps) {
  const height = (block.end - block.start) * PX_PER_MINUTE;
  const states = [block.pinned && 'fixado', block.done && 'concluído'].filter(Boolean).join(', ');
  return (
    <button
      type="button"
      className={cx(styles.block, styles[`block-${task.priority}`], block.done && styles.blockDone, block.pinned && styles.blockPinned)}
      style={{ top: (block.start - rangeStart) * PX_PER_MINUTE, height: height - 3 }}
      onClick={() => onSelect(block)}
      aria-label={`${task.title}, ${formatTimeRange(block.start, block.end)}, prioridade ${PRIORITY_LABEL[task.priority].toLowerCase()}${states ? `, ${states}` : ''}`}
    >
      <span className={styles.blockTitle}>{task.title}</span>
      {height >= 44 && (
        <span className={styles.blockTime}>
          {formatTimeRange(block.start, block.end)} · {formatDuration(block.end - block.start)}
        </span>
      )}
      {(block.pinned || block.done) && (
        <span className={styles.blockIcons} aria-hidden="true">
          {block.pinned && <Icon name="lock" size={14} />}
          {block.done && <Icon name="check" size={14} />}
        </span>
      )}
    </button>
  );
}
