import type {
  AuthService,
  BlockRepository,
  CommitmentRepository,
  SettingsRepository,
  TaskRepository,
} from './contracts';

/** Repositórios de dados do usuário (sem autenticação). */
export interface DataServices {
  commitments: CommitmentRepository;
  tasks: TaskRepository;
  blocks: BlockRepository;
  settings: SettingsRepository;
}

/**
 * Conjunto de serviços usado pela interface. A UI depende só destes contratos,
 * então trocar mock → Firebase (etapa 3) não muda nenhum componente.
 */
export interface AppServices extends DataServices {
  auth: AuthService;
}
