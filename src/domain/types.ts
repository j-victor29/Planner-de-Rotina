/**
 * Tipos centrais do domínio. Não dependem de React nem de Firebase.
 * Horários do dia são representados em minutos desde 00:00 (ex.: 19:30 = 1170).
 * Datas usam "YYYY-MM-DD" e instantes usam "YYYY-MM-DDTHH:mm", sempre no
 * horário local do usuário (America/Sao_Paulo, P10).
 */

export type Id = string;

/** Data sem hora, no formato "YYYY-MM-DD". */
export type IsoDate = string;

/** Data e hora local no formato "YYYY-MM-DDTHH:mm". */
export type IsoDateTime = string;

/** Minutos desde 00:00 (0–1440). */
export type MinuteOfDay = number;

/** Dia da semana: 0 = domingo … 6 = sábado (a semana começa no domingo, P10). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Priority = 'alta' | 'media' | 'baixa';

export const PRIORITIES: readonly Priority[] = ['alta', 'media', 'baixa'];

/** RF02 — compromisso fixo da rotina (aula, trabalho). */
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

/** RF04 — bloco de trabalho alocado para uma tarefa em um dia. */
export interface PlanBlock {
  id: Id;
  taskId: Id;
  date: IsoDate;
  start: MinuteOfDay;
  end: MinuteOfDay;
  /** RF07 / RN05 — bloco fixado não é alterado pelo recálculo. */
  pinned: boolean;
  /** RF08 — bloco concluído (também não é alterado pelo recálculo). */
  done: boolean;
}

/** RF11, RF12 — preferências usadas pelo planejamento. */
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

/** Entrada do algoritmo. Mesma entrada → mesma saída (RNF06). */
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
