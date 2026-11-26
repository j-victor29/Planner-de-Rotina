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

/** Período do dia em que o usuário prefere fazer as tarefas. */
export type PreferredPeriod = 'manha' | 'tarde' | 'noite' | 'qualquer';

export const PREFERRED_PERIODS: readonly PreferredPeriod[] = ['manha', 'tarde', 'noite', 'qualquer'];

/** RF11, RF12 — preferências usadas pelo planejamento. */
export interface UserSettings {
  /** Limite de horas de tarefas por dia (RN04). */
  dailyLimitMinutes: number;
  /** Limite no sábado e no domingo; null = igual ao limite diário. */
  weekendLimitMinutes: number | null;
  /** Horário em que vai dormir. O sono pode atravessar a meia-noite. */
  sleepStart: MinuteOfDay;
  /** Horário em que acorda. O planner só usa o tempo acordado (RF12). */
  sleepEnd: MinuteOfDay;
  /** Período preferido para os blocos de tarefa. */
  preferredPeriod: PreferredPeriod;
  /** Dias de descanso/lazer: nenhum bloco de tarefa é colocado neles. */
  restDays: Weekday[];
  /** Pausa entre blocos de tarefa (0 ou 30 min). */
  breakMinutes: number;
}

export type AuthProvider = 'password' | 'google';

export interface UserProfile {
  id: Id;
  name: string;
  email: string;
  provider: AuthProvider;
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
