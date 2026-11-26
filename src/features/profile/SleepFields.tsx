import styles from './profile.module.css';
import { Alert } from '@/components/ui/Alert';
import { TimeField } from '@/components/ui/TimeField';
import { formatDuration, formatMinute, parseClock, sleepMinutes, sleepWarning } from '@/domain';

interface SleepFieldsProps {
  bedtime: string;
  wake: string;
  onBedtime: (value: string) => void;
  onWake: (value: string) => void;
  errors: { bedtime?: string; wake?: string };
}

/** Horário de dormir e de acordar, com o resumo e o aviso de menos de 8 h. */
export function SleepFields({ bedtime, wake, onBedtime, onWake, errors }: SleepFieldsProps) {
  const start = parseClock(bedtime);
  const end = parseClock(wake);
  const both = start.ok && end.ok ? { sleepStart: start.minutes % 1440, sleepEnd: end.minutes % 1440 } : null;
  const minutes = both ? sleepMinutes(both) : 0;
  const warning = both ? sleepWarning(both) : null;

  return (
    <div className={styles.sleep}>
      <div className={styles.sleepRow}>
        <TimeField label="Vou dormir às" value={bedtime} onChange={onBedtime} error={errors.bedtime} />
        <TimeField label="Acordo às" value={wake} onChange={onWake} error={errors.wake} />
      </div>
      {both && minutes > 0 && (
        <p className={styles.sleepSummary}>
          Você dorme <strong>{formatDuration(minutes)}</strong>. O planner só usa o tempo em que você está acordado,
          das {formatMinute(both.sleepEnd)} às {formatMinute(both.sleepStart)}.
        </p>
      )}
      {warning && (
        <Alert tone="warning" title="Atenção ao sono">
          {warning}
        </Alert>
      )}
    </div>
  );
}
