import type {
  FixedCommitment,
  FixedCommitmentInput,
  Id,
  IsoDateTime,
  PlanBlock,
  Task,
  TaskInput,
  UserSettings,
} from '@/domain';

/**
 * Contratos de acesso a dados. Todas as operações são do usuário logado:
 * a implementação resolve o usuário (isolamento entre contas, RNF05).
 */

export interface CommitmentRepository {
  list(): Promise<FixedCommitment[]>;
  create(input: FixedCommitmentInput): Promise<FixedCommitment>;
  update(id: Id, input: FixedCommitmentInput): Promise<FixedCommitment>;
  remove(id: Id): Promise<void>;
}

export interface TaskRepository {
  list(): Promise<Task[]>;
  create(input: TaskInput): Promise<Task>;
  update(id: Id, input: TaskInput): Promise<Task>;
  remove(id: Id): Promise<void>;
}

export interface BlockRepository {
  listBetween(start: IsoDateTime, end: IsoDateTime): Promise<PlanBlock[]>;
  listAll(): Promise<PlanBlock[]>;
  /** Substitui os blocos não fixados/não concluídos pelos novos (resultado do recálculo). */
  replacePlan(blocks: PlanBlock[]): Promise<void>;
  update(block: PlanBlock): Promise<PlanBlock>;
}

export interface SettingsRepository {
  get(): Promise<UserSettings>;
  save(settings: UserSettings): Promise<UserSettings>;
}
