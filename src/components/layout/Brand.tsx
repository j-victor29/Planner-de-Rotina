import { Link } from 'react-router-dom';
import styles from './layout.module.css';
import { ROUTES } from '@/app/routes';

export function Brand() {
  return (
    <Link to={ROUTES.week} className={styles.brand}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
        <rect x="7" y="8" width="5" height="16" rx="2.5" fill="#fff" opacity=".55" />
        <rect x="13.5" y="12" width="5" height="12" rx="2.5" fill="#fff" />
        <rect x="20" y="6" width="5" height="12" rx="2.5" fill="#fff" opacity=".8" />
      </svg>
      <span>
        Planner <strong>de Rotina</strong>
      </span>
    </Link>
  );
}
