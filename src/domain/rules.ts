/**
 * Constantes das regras de negócio. Valores marcados com "P#" dependem de
 * decisões em aberto (docs/requisitos/09-pontos-em-aberto.md) e podem mudar.
 */
export const RULES = {
  /** P7 — granularidade: tudo começa em :00 ou :30. */
  SLOT_MINUTES: 30,
  /** RN07 / P9 — tamanho mínimo e máximo de um bloco. */
  BLOCK_MIN_MINUTES: 30,
  BLOCK_MAX_MINUTES: 120,
  /** RN09 — faixa permitida do limite diário. */
  DAILY_LIMIT_MIN_MINUTES: 60,
  DAILY_LIMIT_MAX_MINUTES: 16 * 60,
  /** RN02 — duração máxima de uma tarefa (sugestão, a confirmar). */
  TASK_MAX_MINUTES: 200 * 60,
  /** P10 — fuso usado no planejamento. */
  TIME_ZONE: 'America/Sao_Paulo',
} as const;

export const DEFAULT_SETTINGS = {
  dailyLimitMinutes: 4 * 60,
  windowStart: 7 * 60,
  windowEnd: 23 * 60,
} as const;
