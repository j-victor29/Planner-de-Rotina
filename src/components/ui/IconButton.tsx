import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';
import styles from './ui.module.css';
import { cx } from '@/utils/cx';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Obrigatório: nome do botão para leitores de tela. */
  label: string;
}

export function IconButton({ icon, label, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx(styles.iconButton, className)} aria-label={label} title={label} {...rest}>
      <Icon name={icon} />
    </button>
  );
}
