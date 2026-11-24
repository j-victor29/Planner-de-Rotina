import { useState, type FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import {
  formatDuration,
  hasErrors,
  RULES,
  validateSettings,
  type UserSettings,
  type ValidationErrors,
} from '@/domain';
import page from '@/features/shared/page.module.css';
import { timeOptions } from '@/utils/format';

const LIMIT_OPTIONS = Array.from(
  { length: (RULES.DAILY_LIMIT_MAX_MINUTES - RULES.DAILY_LIMIT_MIN_MINUTES) / 30 + 1 },
  (_, i) => {
    const minutes = RULES.DAILY_LIMIT_MIN_MINUTES + i * 30;
    return { value: String(minutes), label: formatDuration(minutes) };
  },
);

interface SettingsFormProps {
  value: UserSettings;
  submitLabel?: string;
  /** Retorna true quando salvou. */
  onSubmit: (settings: UserSettings) => Promise<boolean>;
}

/** RF11, RF12 — limite diário e janela de horário. */
export function SettingsForm({ value, submitLabel = 'Salvar preferências', onSubmit }: SettingsFormProps) {
  const [form, setForm] = useState(value);
  const [errors, setErrors] = useState<ValidationErrors<UserSettings>>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateSettings(form);
    setErrors(found);
    setSaved(false);
    if (hasErrors(found)) return;
    setBusy(true);
    try {
      setSaved(await onSubmit(form));
    } finally {
      setBusy(false);
    }
  }

  const update = (key: keyof UserSettings) => (e: { target: { value: string } }) => {
    setSaved(false);
    setForm({ ...form, [key]: Number(e.target.value) });
  };

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      <SelectField
        label="Limite de horas por dia"
        hint="O plano nunca coloca mais do que isso em um dia."
        options={LIMIT_OPTIONS}
        value={String(form.dailyLimitMinutes)}
        onChange={update('dailyLimitMinutes')}
        error={errors.dailyLimitMinutes}
      />
      <div className={page.formRow}>
        <SelectField
          label="Começar a partir de"
          options={timeOptions(0, 23 * 60)}
          value={String(form.windowStart)}
          onChange={update('windowStart')}
          error={errors.windowStart}
        />
        <SelectField
          label="Terminar até"
          options={timeOptions(60, 24 * 60)}
          value={String(form.windowEnd)}
          onChange={update('windowEnd')}
          error={errors.windowEnd}
        />
      </div>
      {saved && <Alert tone="success">Preferências salvas. O plano foi recalculado.</Alert>}
      <div className={page.formActions}>
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
