import { useId, type SelectHTMLAttributes } from 'react';
import { describedBy } from './describedBy';
import { Field } from './Field';
import styles from './ui.module.css';
import type { Option } from '@/utils/format';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  hint?: string;
  error?: string;
}

export function SelectField({ label, options, hint, error, id, ...rest }: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <Field id={selectId} label={label} hint={hint} error={error}>
      <select
        id={selectId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(selectId, hint, error)}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
