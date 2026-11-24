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
  /** RF12 — a janela de planejamento precisa ter pelo menos 1 hora. */
  WINDOW_MIN_MINUTES: 60,
  /** P10 — fuso usado no planejamento. */
  TIME_ZONE: 'America/Sao_Paulo',
} as const;

export const DEFAULT_SETTINGS = {
  dailyLimitMinutes: 4 * 60,
  windowStart: 7 * 60,
  windowEnd: 23 * 60,
} as const;
