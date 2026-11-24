import styles from './planning.module.css';

export function Legend() {
  return (
    <ul className={styles.legend} aria-label="Legenda">
      <li>
        <span className={`${styles.swatch} ${styles.swatchCommitment}`} /> Compromisso fixo
      </li>
      <li>
        <span className={`${styles.swatch} ${styles.swatchFree}`} /> Livre
      </li>
      <li>
        <span className={`${styles.swatch} ${styles['swatch-alta']}`} /> Alta
      </li>
      <li>
        <span className={`${styles.swatch} ${styles['swatch-media']}`} /> Média
      </li>
      <li>
        <span className={`${styles.swatch} ${styles['swatch-baixa']}`} /> Baixa
      </li>
    </ul>
  );
}
