import { TextField } from './TextField';
import styles from './ui.module.css';
import { maskClock } from '@/domain';
import { cx } from '@/utils/cx';

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
}

/** Horário digitado com máscara (1930 → 19:30). Só :00 e :30 são aceitos na validação. */
export function TimeField({ label, value, onChange, error, hint }: TimeFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      inputMode="numeric"
      autoComplete="off"
      placeholder="00:00"
      maxLength={5}
      className={cx(styles.input, styles.timeInput)}
      onChange={(e) => onChange(maskClock(e.target.value))}
      error={error}
      hint={hint}
    />
  );
}
