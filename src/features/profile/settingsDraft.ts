import {
  formatDuration,
  hasErrors,
  parseClock,
  parseDuration,
  validateSettings,
  type PreferredPeriod,
  type UserSettings,
  type Weekday,
} from '@/domain';
import { clockText } from '@/utils/format';

/** Valores do formulário de preferências como o usuário digita (texto). */
export interface SettingsDraft {
  bedtime: string;
  wake: string;
  limit: string;
  weekendDifferent: boolean;
  weekendLimit: string;
  preferredPeriod: PreferredPeriod;
  restDays: Weekday[];
  breakMinutes: number;
}

export type DraftErrors = Partial<Record<keyof SettingsDraft, string>>;

export function toDraft(settings: UserSettings): SettingsDraft {
  return {
    bedtime: clockText(settings.sleepStart),
    wake: clockText(settings.sleepEnd),
    limit: formatDuration(settings.dailyLimitMinutes),
    weekendDifferent: settings.weekendLimitMinutes !== null,
    weekendLimit: formatDuration(settings.weekendLimitMinutes ?? settings.dailyLimitMinutes),
    preferredPeriod: settings.preferredPeriod,
    restDays: [...settings.restDays],
    breakMinutes: settings.breakMinutes,
  };
}

/** Converte o rascunho em configurações válidas, ou devolve os erros por campo. */
export function fromDraft(draft: SettingsDraft): { settings: UserSettings | null; errors: DraftErrors } {
  const errors: DraftErrors = {};
  const read = (key: keyof SettingsDraft, result: ReturnType<typeof parseClock>) => {
    if (result.ok) return result.minutes;
    errors[key] = result.error;
    return Number.NaN;
  };

  const settings: UserSettings = {
    sleepStart: read('bedtime', parseClock(draft.bedtime)) % (24 * 60),
    sleepEnd: read('wake', parseClock(draft.wake)) % (24 * 60),
    dailyLimitMinutes: read('limit', parseDuration(draft.limit)),
    weekendLimitMinutes: draft.weekendDifferent ? read('weekendLimit', parseDuration(draft.weekendLimit)) : null,
    preferredPeriod: draft.preferredPeriod,
    restDays: [...draft.restDays],
    breakMinutes: draft.breakMinutes,
  };

  if (!hasErrors(errors)) {
    const found = validateSettings(settings);
    if (found.sleepStart) errors.bedtime = found.sleepStart;
    if (found.sleepEnd) errors.wake = found.sleepEnd;
    if (found.dailyLimitMinutes) errors.limit = found.dailyLimitMinutes;
    if (found.weekendLimitMinutes) errors.weekendLimit = found.weekendLimitMinutes;
    if (found.restDays) errors.restDays = found.restDays;
    if (found.preferredPeriod) errors.preferredPeriod = found.preferredPeriod;
    if (found.breakMinutes) errors.breakMinutes = found.breakMinutes;
  }
  return { settings: hasErrors(errors) ? null : settings, errors };
}
