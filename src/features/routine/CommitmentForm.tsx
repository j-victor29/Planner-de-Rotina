import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { WeekdayPicker } from '@/components/ui/WeekdayPicker';
import { hasErrors, validateCommitment, type FixedCommitmentInput, type ValidationErrors } from '@/domain';
import page from '@/features/shared/page.module.css';
import { timeOptions } from '@/utils/format';

const EMPTY: FixedCommitmentInput = { title: '', weekdays: [1, 2, 3, 4, 5], start: 8 * 60, end: 12 * 60 };

interface CommitmentFormProps {
  initialValue?: FixedCommitmentInput;
  submitLabel?: string;
  /** Retorna true quando salvou. */
  onSubmit: (input: FixedCommitmentInput) => Promise<boolean>;
  onCancel?: () => void;
}

/** RF02 — formulário de compromisso fixo. */
export function CommitmentForm({ initialValue, submitLabel = 'Salvar', onSubmit, onCancel }: CommitmentFormProps) {
  const [form, setForm] = useState<FixedCommitmentInput>(initialValue ?? EMPTY);
  const [errors, setErrors] = useState<ValidationErrors<FixedCommitmentInput>>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const input = { ...form, title: form.title.trim() };
    const found = validateCommitment(input);
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
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={errors.title}
      />
      <WeekdayPicker
        label="Dias da semana"
        value={form.weekdays}
        onChange={(weekdays) => setForm({ ...form, weekdays })}
        error={errors.weekdays}
      />
      <div className={page.formRow}>
        <SelectField
          label="Início"
          options={timeOptions(0, 23 * 60 + 30)}
          value={String(form.start)}
          onChange={(e) => setForm({ ...form, start: Number(e.target.value) })}
          error={errors.start}
        />
        <SelectField
          label="Fim"
          options={timeOptions(30, 24 * 60)}
          value={String(form.end)}
          onChange={(e) => setForm({ ...form, end: Number(e.target.value) })}
          error={errors.end}
        />
      </div>
      <p className={page.cardText}>Não precisa cadastrar o sono: ele fica fora da sua janela de horário (Perfil).</p>
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
