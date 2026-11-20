import type {
  AuthService,
  BlockRepository,
  CommitmentRepository,
  SettingsRepository,
  TaskRepository,
} from './contracts';

/**
 * Conjunto de serviços usado pela interface. A UI depende só destes contratos,
 * então trocar mock → Firebase (etapa 3) não muda nenhum componente.
 */
export interface AppServices {
  auth: AuthService;
  commitments: CommitmentRepository;
  tasks: TaskRepository;
  blocks: BlockRepository;
  settings: SettingsRepository;
}
