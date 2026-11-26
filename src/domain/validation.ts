import { RULES } from './rules';
import { awakeIntervals, sleepMinutes } from './schedule';
import { formatDuration, isOnSlot, isValidDate } from './time';
import {
  PREFERRED_PERIODS,
  PRIORITIES,
  type FixedCommitmentInput,
  type IsoDate,
  type TaskInput,
  type UserSettings,
} from './types';

/** Erros por campo. Objeto vazio = válido. Cada valor é uma mensagem para o usuário. */
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

function validateTitle(title: string, emptyMessage: string): string | undefined {
  const trimmed = title.trim();
  if (!trimmed) return emptyMessage;
  if (trimmed.length > RULES.TITLE_MAX_LENGTH) {
    return `Use no máximo ${RULES.TITLE_MAX_LENGTH} caracteres.`;
  }
  return undefined;
}

/** RF03, RN01, RN02 — valida os dados de uma tarefa. */
export function validateTask(input: TaskInput, today: IsoDate): ValidationErrors<TaskInput> {
  const errors: ValidationErrors<TaskInput> = {};

  const title = validateTitle(input.title, 'Informe o título da tarefa.');
  if (title) errors.title = title;

  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    errors.durationMinutes = 'A duração deve ser maior que zero.';
  } else if (input.durationMinutes > RULES.TASK_MAX_MINUTES) {
    errors.durationMinutes = `A duração máxima é de ${formatDuration(RULES.TASK_MAX_MINUTES)}.`;
  }

  if (!isValidDate(input.deadline)) {
    errors.deadline = 'Informe um prazo válido.';
  } else if (input.deadline < today) {
    errors.deadline = 'O prazo não pode ser anterior a hoje.';
  }

  if (!PRIORITIES.includes(input.priority)) {
    errors.priority = 'Escolha a prioridade.';
  }

  return errors;
}

function isValidMinute(value: number): boolean {
  return isOnSlot(value) && value >= 0 && value <= 24 * 60;
}

/** RF02, RN10 — valida um compromisso fixo. */
export function validateCommitment(
  input: FixedCommitmentInput,
): ValidationErrors<FixedCommitmentInput> {
  const errors: ValidationErrors<FixedCommitmentInput> = {};

  const title = validateTitle(input.title, 'Informe o nome do compromisso.');
  if (title) errors.title = title;

  if (input.weekdays.length === 0) {
    errors.weekdays = 'Escolha pelo menos um dia da semana.';
  }

  if (!isValidMinute(input.start)) {
    errors.start = 'Escolha um horário de início válido.';
  }
  if (!isValidMinute(input.end)) {
    errors.end = 'Escolha um horário de fim válido.';
  } else if (isValidMinute(input.start) && input.end <= input.start) {
    errors.end = 'O horário de fim deve ser depois do início.';
  }

  return errors;
}

const limitInRange = (value: number) =>
  isOnSlot(value) && value >= RULES.DAILY_LIMIT_MIN_MINUTES && value <= RULES.DAILY_LIMIT_MAX_MINUTES;

/** RF11, RF12, RN09 — valida as configurações do usuário. */
export function validateSettings(input: UserSettings): ValidationErrors<UserSettings> {
  const errors: ValidationErrors<UserSettings> = {};

  if (!limitInRange(input.dailyLimitMinutes)) {
    errors.dailyLimitMinutes = 'O limite diário deve ficar entre 1 e 16 horas.';
  }
  if (input.weekendLimitMinutes !== null && !limitInRange(input.weekendLimitMinutes)) {
    errors.weekendLimitMinutes = 'O limite do fim de semana deve ficar entre 1 e 16 horas.';
  }

  if (!isValidMinute(input.sleepStart)) errors.sleepStart = 'Informe um horário válido.';
  if (!isValidMinute(input.sleepEnd)) {
    errors.sleepEnd = 'Informe um horário válido.';
  } else if (isValidMinute(input.sleepStart)) {
    if (sleepMinutes(input) === 0) {
      errors.sleepEnd = 'Os horários de dormir e acordar não podem ser iguais.';
    } else if (
      awakeIntervals(input).reduce((sum, i) => sum + i.end - i.start, 0) < RULES.AWAKE_MIN_MINUTES
    ) {
      errors.sleepEnd = 'Você precisa ficar acordado pelo menos 1 hora por dia.';
    }
  }

  if (new Set(input.restDays).size >= 7) {
    errors.restDays = 'Deixe pelo menos um dia da semana para planejar.';
  }
  if (!PREFERRED_PERIODS.includes(input.preferredPeriod)) {
    errors.preferredPeriod = 'Escolha um período.';
  }
  if (!(RULES.BREAK_OPTIONS as readonly number[]).includes(input.breakMinutes)) {
    errors.breakMinutes = 'Escolha uma pausa válida.';
  }

  return errors;
}

/** Aviso (não bloqueia) quando o sono planejado é menor que 8 h. */
export function sleepWarning(settings: Pick<UserSettings, 'sleepStart' | 'sleepEnd'>): string | null {
  const minutes = sleepMinutes(settings);
  if (minutes === 0 || minutes >= RULES.SLEEP_RECOMMENDED_MINUTES) return null;
  return `Você está planejando ${formatDuration(minutes)} de sono. Dormir menos de 8h pode prejudicar sua saúde e seu rendimento.`;
}
