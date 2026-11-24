import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './ui.module.css';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon = 'sparkle', title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Icon name={icon} size={24} />
      </span>
      <p className={styles.emptyTitle}>{title}</p>
      {description && <p className={styles.emptyText}>{description}</p>}
      {action}
    </div>
  );
}
