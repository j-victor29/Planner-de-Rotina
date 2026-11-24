import type {
  FixedCommitment,
  FixedCommitmentInput,
  Id,
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
  list(): Promise<PlanBlock[]>;
  /** Substitui todos os blocos do usuário (resultado de um recálculo). */
  replaceAll(blocks: PlanBlock[]): Promise<void>;
  update(block: PlanBlock): Promise<PlanBlock>;
}

export interface SettingsRepository {
  get(): Promise<UserSettings>;
  save(settings: UserSettings): Promise<UserSettings>;
}
