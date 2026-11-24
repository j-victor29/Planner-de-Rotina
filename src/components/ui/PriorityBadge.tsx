import styles from './ui.module.css';
import type { Priority } from '@/domain';
import { cx } from '@/utils/cx';
import { PRIORITY_LABEL } from '@/utils/format';

/** Prioridade com cor e texto (nunca só cor, RNF03). */
export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cx(styles.badge, styles[`badge-${priority}`])}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}
