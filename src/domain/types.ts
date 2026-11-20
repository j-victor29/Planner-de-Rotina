/**
 * Tipos centrais do domínio. Não dependem de React nem de Firebase.
 * Horários do dia são representados em minutos desde 00:00 (ex.: 19:30 = 1170).
 * Datas sem hora usam o formato ISO "YYYY-MM-DD"; instantes usam ISO 8601 completo.
 */

export type Id = string;

/** Data sem hora, no formato "YYYY-MM-DD". */
export type IsoDate = string;

/** Instante no formato ISO 8601 (ex.: "2026-11-20T14:30:00-03:00"). */
export type IsoDateTime = string;

/** Minutos desde 00:00 (0–1440). */
export type MinuteOfDay = number;

/** Dia da semana ISO: 1 = segunda … 7 = domingo (P10). */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Priority = 'alta' | 'media' | 'baixa';

/** RF02 — compromisso fixo da rotina (aula, trabalho, sono). */
export interface FixedCommitment {
  id: Id;
  title: string;
  weekdays: Weekday[];
  start: MinuteOfDay;
  end: MinuteOfDay;
}

/** RF03 — tarefa flexível a ser planejada. */
export interface Task {
  id: Id;
  title: string;
  durationMinutes: number;
  deadline: IsoDate;
  priority: Priority;
  createdAt: IsoDateTime;
}

/** RF04 — bloco de trabalho alocado para uma tarefa. */
export interface PlanBlock {
  id: Id;
  taskId: Id;
  start: IsoDateTime;
  end: IsoDateTime;
  /** RF07 / RN05 — bloco fixado não é alterado pelo recálculo. */
  pinned: boolean;
  /** RF08 — bloco concluído. */
  done: boolean;
}

/** RF11, RF12 — preferências do usuário usadas pelo planejamento. */
export interface UserSettings {
  dailyLimitMinutes: number;
  windowStart: MinuteOfDay;
  windowEnd: MinuteOfDay;
}

export interface UserProfile {
  id: Id;
  name: string;
  email: string;
}

/** RF10 — aviso de que uma tarefa não coube até o prazo. */
export interface PlanAlert {
  taskId: Id;
  missingMinutes: number;
}

/** Entrada do algoritmo de planejamento. Mesma entrada → mesma saída (RNF06). */
export interface PlanInput {
  now: IsoDateTime;
  commitments: FixedCommitment[];
  tasks: Task[];
  /** Blocos existentes; fixados e concluídos são preservados. */
  existingBlocks: PlanBlock[];
  settings: UserSettings;
}

export interface PlanResult {
  blocks: PlanBlock[];
  alerts: PlanAlert[];
}

/** Dados de formulário (sem id e campos gerados). */
export type FixedCommitmentInput = Omit<FixedCommitment, 'id'>;
export type TaskInput = Omit<Task, 'id' | 'createdAt'>;
