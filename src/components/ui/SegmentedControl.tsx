import { useId } from 'react';
import styles from './ui.module.css';
import { cx } from '@/utils/cx';

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; tone?: string }[];
  onChange: (value: T) => void;
  error?: string;
}

/** Grupo de opções exclusivas (botões de rádio estilizados). */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
}: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.segmented}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cx(styles.segment, option.tone && styles[`segment-${option.tone}`])}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
