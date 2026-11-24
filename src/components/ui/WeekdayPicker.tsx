import styles from './ui.module.css';
import type { Weekday } from '@/domain';
import { WEEKDAY_LETTER, WEEKDAY_LONG } from '@/utils/format';

interface WeekdayPickerProps {
  label: string;
  value: Weekday[];
  onChange: (value: Weekday[]) => void;
  error?: string;
}

const DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

/** Escolha dos dias da semana (domingo a sábado). */
export function WeekdayPicker({ label, value, onChange, error }: WeekdayPickerProps) {
  const toggle = (day: Weekday) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort());
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.label}>{label}</legend>
      <div className={styles.weekdays}>
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            className={styles.weekday}
            aria-pressed={value.includes(day)}
            aria-label={WEEKDAY_LONG[day]}
            title={WEEKDAY_LONG[day]}
            onClick={() => toggle(day)}
          >
            {WEEKDAY_LETTER[day]}
          </button>
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
