import type { UserSettings } from './types';

/**
 * Constantes das regras de negócio. Valores marcados com "P#" dependem de
 * decisões em aberto (docs/requisitos/09-pontos-em-aberto.md) e podem mudar.
 */
export const RULES = {
  /** P7 — granularidade: tudo começa em :00 ou :30. */
  SLOT_MINUTES: 30,
  /** RN07 / P9 — bloco mínimo absoluto (só para o restante de uma tarefa). */
  BLOCK_MIN_MINUTES: 30,
  /** RN07 / P9 — tamanho mínimo preferido de um bloco. */
  BLOCK_PREFERRED_MIN_MINUTES: 60,
  /** RN07 / P9 — tamanho máximo de um bloco. */
  BLOCK_MAX_MINUTES: 120,
  /** RN09 — faixa permitida do limite diário. */
  DAILY_LIMIT_MIN_MINUTES: 60,
  DAILY_LIMIT_MAX_MINUTES: 16 * 60,
  /** RN02 — duração máxima de uma tarefa (sugestão, a confirmar). */
  TASK_MAX_MINUTES: 200 * 60,
  /** Tamanho máximo do título de tarefas e compromissos. */
  TITLE_MAX_LENGTH: 80,
  /** O usuário precisa ficar acordado pelo menos 1 hora por dia. */
  AWAKE_MIN_MINUTES: 60,
  /** Abaixo disso o sistema avisa (só aviso, não bloqueia). */
  SLEEP_RECOMMENDED_MINUTES: 8 * 60,
  /** Pausas entre blocos permitidas. */
  BREAK_OPTIONS: [0, 30],
  /** P10 — fuso usado no planejamento. */
  TIME_ZONE: 'America/Sao_Paulo',
} as const;

/** Faixas dos períodos do dia (minutos). */
export const PERIOD_RANGES = {
  manha: { start: 0, end: 12 * 60 },
  tarde: { start: 12 * 60, end: 18 * 60 },
  noite: { start: 18 * 60, end: 24 * 60 },
} as const;

export const DEFAULT_SETTINGS: UserSettings = {
  dailyLimitMinutes: 4 * 60,
  weekendLimitMinutes: null,
  sleepStart: 23 * 60,
  sleepEnd: 7 * 60,
  preferredPeriod: 'qualquer',
  restDays: [],
  breakMinutes: 0,
};

/** Cópia nova das configurações padrão (evita compartilhar o array restDays). */
export function defaultSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS, restDays: [] };
}
