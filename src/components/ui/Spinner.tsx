import styles from './ui.module.css';

export function Spinner({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className={styles.spinnerWrap} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
