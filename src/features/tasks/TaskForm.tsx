import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { DurationField } from '@/components/ui/DurationField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import {
  addDays,
  dateOf,
  formatDuration,
  fromJsDate,
  hasErrors,
  parseDuration,
  validateTask,
  type Priority,
  type TaskInput,
  type ValidationErrors,
} from '@/domain';
import page from '@/features/shared/page.module.css';
import { PRIORITY_LABEL } from '@/utils/format';

const PRIORITY_OPTIONS = (['alta', 'media', 'baixa'] as const).map((p) => ({
  value: p,
  label: PRIORITY_LABEL[p],
  tone: p,
}));

interface TaskFormProps {
  initialValue?: TaskInput;
  submitLabel?: string;
  cancelLabel?: string;
  /** Data de hoje (injetável para testes). */
  today?: string;
  /** Retorna true quando salvou. */
  onSubmit: (input: TaskInput) => Promise<boolean>;
  onCancel?: () => void;
}

/** RF03 — formulário de tarefa (duração digitada, prazo e prioridade). */
export function TaskForm({
  initialValue,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  today,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const currentDay = today ?? dateOf(fromJsDate(new Date()));
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [duration, setDuration] = useState(initialValue ? formatDuration(initialValue.durationMinutes) : '');
  const [deadline, setDeadline] = useState(initialValue?.deadline ?? addDays(currentDay, 7));
  const [priority, setPriority] = useState<Priority>(initialValue?.priority ?? 'media');
  const [errors, setErrors] = useState<ValidationErrors<TaskInput>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsed = parseDuration(duration);
    const input: TaskInput = {
      title: title.trim(),
      durationMinutes: parsed.ok ? parsed.minutes : 0,
      deadline,
      priority,
    };
    const found = validateTask(input, currentDay);
    if (!parsed.ok) found.durationMinutes = parsed.error;
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
        label="Título"
        placeholder="Ex.: TCC, prova de Cálculo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />
      <div className={page.formRow}>
        <DurationField
          label="Quanto tempo leva?"
          value={duration}
          onChange={setDuration}
          error={errors.durationMinutes}
          hint="Ex.: 2, 2:30 ou 10h30."
        />
        <TextField
          label="Prazo"
          type="date"
          min={currentDay}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          error={errors.deadline}
        />
      </div>
      <SegmentedControl
        label="Prioridade"
        value={priority}
        options={PRIORITY_OPTIONS}
        onChange={setPriority}
        error={errors.priority}
      />
      <div className={page.formActions}>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
