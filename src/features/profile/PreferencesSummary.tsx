import styles from './profile.module.css';
import { formatDuration, formatMinute, sleepMinutes, type UserSettings } from '@/domain';
import { PERIOD_LABEL, WEEKDAY_LONG } from '@/utils/format';

/** Resumo das preferências (usado na demonstração). */
export function PreferencesSummary({ settings }: { settings: UserSettings }) {
  const rows: [string, string][] = [
    [
      'Sono',
      `${formatMinute(settings.sleepStart)} às ${formatMinute(settings.sleepEnd)} (${formatDuration(sleepMinutes(settings))})`,
    ],
    ['Limite por dia', formatDuration(settings.dailyLimitMinutes)],
    [
      'Fim de semana',
      settings.weekendLimitMinutes === null ? 'Mesmo limite' : formatDuration(settings.weekendLimitMinutes),
    ],
    ['Período preferido', PERIOD_LABEL[settings.preferredPeriod]],
    [
      'Dias de descanso',
      settings.restDays.length ? settings.restDays.map((d) => WEEKDAY_LONG[d]).join(', ') : 'Nenhum',
    ],
    ['Pausa entre blocos', settings.breakMinutes ? `${settings.breakMinutes} min` : 'Sem pausa'],
  ];
  return (
    <dl className={styles.summary}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
