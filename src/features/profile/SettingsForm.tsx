import { useState, type FormEvent, type ReactNode } from 'react';
import styles from './profile.module.css';
import { fromDraft, toDraft, type DraftErrors, type SettingsDraft } from './settingsDraft';
import { SleepFields } from './SleepFields';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DurationField } from '@/components/ui/DurationField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { WeekdayPicker } from '@/components/ui/WeekdayPicker';
import uiStyles from '@/components/ui/ui.module.css';
import { PREFERRED_PERIODS, type UserSettings } from '@/domain';
import page from '@/features/shared/page.module.css';
import { PERIOD_LABEL } from '@/utils/format';

const PERIOD_OPTIONS = PREFERRED_PERIODS.map((p) => ({ value: p, label: PERIOD_LABEL[p] }));
const BREAK_OPTIONS = [
  { value: '0', label: 'Sem pausa' },
  { value: '30', label: '30 min' },
];

interface SettingsFormProps {
  value: UserSettings;
  /** Mostrar os campos de sono (padrão: sim). */
  showSleep?: boolean;
  submitLabel?: string;
  /** Botões extras ao lado de salvar (ex.: "Voltar" no passo a passo). */
  extraActions?: ReactNode;
  /** Mostrar a mensagem de "salvo" (desligado no passo a passo). */
  showSaved?: boolean;
  /** Retorna true quando salvou. */
  onSubmit: (settings: UserSettings) => Promise<boolean>;
}

/** RF11, RF12 — sono, limite diário, período preferido, descanso e pausa. */
export function SettingsForm({
  value,
  showSleep = true,
  submitLabel = 'Salvar preferências',
  extraActions,
  showSaved = true,
  onSubmit,
}: SettingsFormProps) {
  const [draft, setDraft] = useState<SettingsDraft>(() => toDraft(value));
  const [errors, setErrors] = useState<DraftErrors>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof SettingsDraft>(key: K, next: SettingsDraft[K]) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [key]: next }));
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = fromDraft(draft);
    setErrors(result.errors);
    setSaved(false);
    if (!result.settings) return;
    setBusy(true);
    try {
      setSaved(await onSubmit(result.settings));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      {showSleep && (
        <fieldset className={styles.section}>
          <legend className={styles.sectionTitle}>Sono</legend>
          <SleepFields
            bedtime={draft.bedtime}
            wake={draft.wake}
            onBedtime={(v) => set('bedtime', v)}
            onWake={(v) => set('wake', v)}
            errors={errors}
          />
        </fieldset>
      )}

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Ritmo de trabalho</legend>
        <DurationField
          label="Limite de horas de tarefas por dia"
          value={draft.limit}
          onChange={(v) => set('limit', v)}
          error={errors.limit}
          hint="Entre 1 e 16 horas. Ex.: 3 ou 2:30."
          placeholder="Ex.: 3"
        />
        <label className={uiStyles.checkbox}>
          <input
            type="checkbox"
            checked={draft.weekendDifferent}
            onChange={(e) => set('weekendDifferent', e.target.checked)}
          />
          Limite diferente no fim de semana
        </label>
        {draft.weekendDifferent && (
          <DurationField
            label="Limite no sábado e no domingo"
            value={draft.weekendLimit}
            onChange={(v) => set('weekendLimit', v)}
            error={errors.weekendLimit}
            hint="Entre 1 e 16 horas."
            placeholder="Ex.: 2"
          />
        )}
        <SegmentedControl
          label="Pausa entre blocos de tarefa"
          value={String(draft.breakMinutes)}
          options={BREAK_OPTIONS}
          onChange={(v) => set('breakMinutes', Number(v))}
          error={errors.breakMinutes}
        />
      </fieldset>

      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Quando fazer as tarefas</legend>
        <SegmentedControl
          label="Período preferido"
          value={draft.preferredPeriod}
          options={PERIOD_OPTIONS}
          onChange={(v) => set('preferredPeriod', v)}
          error={errors.preferredPeriod}
        />
        <div>
          <WeekdayPicker
            label="Dias de descanso ou lazer"
            value={draft.restDays}
            onChange={(v) => set('restDays', v)}
            error={errors.restDays}
          />
          <p className={styles.hint}>Nesses dias o planner não coloca nenhuma tarefa.</p>
        </div>
      </fieldset>

      {saved && showSaved && <Alert tone="success">Preferências salvas. O plano foi recalculado.</Alert>}
      <div className={page.formActions}>
        {extraActions}
        <Button type="submit" loading={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
