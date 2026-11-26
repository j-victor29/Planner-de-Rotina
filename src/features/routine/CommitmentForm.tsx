import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { TimeField } from '@/components/ui/TimeField';
import { WeekdayPicker } from '@/components/ui/WeekdayPicker';
import {
  hasErrors,
  parseClock,
  validateCommitment,
  type FixedCommitmentInput,
  type ValidationErrors,
  type Weekday,
} from '@/domain';
import page from '@/features/shared/page.module.css';
import { clockText } from '@/utils/format';

interface CommitmentFormProps {
  initialValue?: FixedCommitmentInput;
  submitLabel?: string;
  /** Retorna true quando salvou. */
  onSubmit: (input: FixedCommitmentInput) => Promise<boolean>;
  onCancel?: () => void;
}

/** RF02 — formulário de compromisso fixo, com horários digitados. */
export function CommitmentForm({ initialValue, submitLabel = 'Salvar', onSubmit, onCancel }: CommitmentFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [weekdays, setWeekdays] = useState<Weekday[]>(initialValue?.weekdays ?? [1, 2, 3, 4, 5]);
  const [start, setStart] = useState(initialValue ? clockText(initialValue.start) : '');
  const [end, setEnd] = useState(initialValue ? clockText(initialValue.end) : '');
  const [errors, setErrors] = useState<ValidationErrors<FixedCommitmentInput>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsedStart = parseClock(start);
    const parsedEnd = parseClock(end);
    const input: FixedCommitmentInput = {
      title: title.trim(),
      weekdays,
      start: parsedStart.ok ? parsedStart.minutes : 0,
      end: parsedEnd.ok ? parsedEnd.minutes : 0,
    };
    const found = validateCommitment(input);
    if (!parsedStart.ok) found.start = parsedStart.error;
    if (!parsedEnd.ok) found.end = parsedEnd.error;
    setErrors(found);
    if (hasErrors(found)) return;
    setBusy(true);
    try {
      await onSubmit(input);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      <TextField
        label="Nome"
        placeholder="Ex.: Aula, Trabalho, Estágio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />
      <WeekdayPicker label="Dias da semana" value={weekdays} onChange={setWeekdays} error={errors.weekdays} />
      <div className={page.formRow}>
        <TimeField label="Começa às" value={start} onChange={setStart} error={errors.start} />
        <TimeField label="Termina às" value={end} onChange={setEnd} error={errors.end} />
      </div>
      <p className={page.cardText}>Digite os horários de meia em meia hora, por exemplo 19:00 ou 19:30.</p>
      <div className={page.formActions}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
