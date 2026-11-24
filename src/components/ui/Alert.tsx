import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './ui.module.css';
import { cx } from '@/utils/cx';

type Tone = 'info' | 'success' | 'warning' | 'error';

const ICONS: Record<Tone, IconName> = {
  info: 'sparkle',
  success: 'check',
  warning: 'alert',
  error: 'alert',
};

interface AlertProps {
  tone: Tone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}

export function Alert({ tone, title, children, action }: AlertProps) {
  return (
    <div className={cx(styles.alert, styles[`alert-${tone}`])} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon name={ICONS[tone]} className={styles.alertIcon} />
      <div className={styles.alertContent}>
        {title && <p className={styles.alertTitle}>{title}</p>}
        {children}
      </div>
      {action}
    </div>
  );
}
