import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import {
  addDays,
  dateOf,
  fromJsDate,
  hasErrors,
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

const MINUTE_OPTIONS = [
  { value: '0', label: '0 min' },
  { value: '30', label: '30 min' },
];

interface TaskFormProps {
  initialValue?: TaskInput;
  submitLabel?: string;
  /** Data de hoje (injetável para testes). */
  today?: string;
  /** Retorna true quando salvou. */
  onSubmit: (input: TaskInput) => Promise<boolean>;
  onCancel?: () => void;
}

/** RF03 — formulário de tarefa (duração, prazo e prioridade). */
export function TaskForm({ initialValue, submitLabel = 'Salvar', today, onSubmit, onCancel }: TaskFormProps) {
  const currentDay = today ?? dateOf(fromJsDate(new Date()));
  const initial = initialValue ?? { title: '', durationMinutes: 120, deadline: addDays(currentDay, 7), priority: 'media' as Priority };
  const [title, setTitle] = useState(initial.title);
  const [hours, setHours] = useState(String(Math.floor(initial.durationMinutes / 60)));
  const [minutes, setMinutes] = useState(String(initial.durationMinutes % 60 >= 30 ? 30 : 0));
  const [deadline, setDeadline] = useState(initial.deadline);
  const [priority, setPriority] = useState<Priority>(initial.priority);
  const [errors, setErrors] = useState<ValidationErrors<TaskInput>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsedHours = hours.trim() === '' ? 0 : Number(hours);
    const input: TaskInput = {
      title: title.trim(),
      durationMinutes: Math.round(parsedHours * 60) + Number(minutes),
      deadline,
      priority,
    };
    const found = validateTask(input, currentDay);
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
        <TextField
          label="Duração (horas)"
          type="number"
          inputMode="numeric"
          min={0}
          max={200}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          error={errors.durationMinutes}
        />
        <SelectField
          label="e minutos"
          options={MINUTE_OPTIONS}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />
      </div>
      <TextField
        label="Prazo"
        type="date"
        min={currentDay}
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        error={errors.deadline}
        hint="O planner reserva tempo até o fim deste dia."
      />
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
