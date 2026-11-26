import { TextField } from './TextField';

interface DurationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
}

/** Duração digitada: "2", "2:30" ou "2h30". */
export function DurationField({
  label,
  value,
  onChange,
  error,
  hint = 'Ex.: 2, 2:30 ou 10h30 (de meia em meia hora).',
  placeholder = 'Ex.: 2h30',
}: DurationFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      inputMode="decimal"
      autoComplete="off"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      hint={hint}
    />
  );
}
