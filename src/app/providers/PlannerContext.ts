import { createContext, useContext } from 'react';
import type {
  FixedCommitment,
  FixedCommitmentInput,
  Id,
  IsoDate,
  PlanAlert,
  PlanBlock,
  Task,
  TaskInput,
  UserSettings,
} from '@/domain';

export interface PlannerActions {
  /** Retorna false (e abre o cadastro) quando o visitante não está logado. */
  ensureAccess: () => boolean;
  createTask: (input: TaskInput) => Promise<boolean>;
  updateTask: (id: Id, input: TaskInput) => Promise<boolean>;
  deleteTask: (id: Id) => Promise<boolean>;
  createCommitment: (input: FixedCommitmentInput) => Promise<boolean>;
  updateCommitment: (id: Id, input: FixedCommitmentInput) => Promise<boolean>;
  deleteCommitment: (id: Id) => Promise<boolean>;
  saveSettings: (settings: UserSettings) => Promise<boolean>;
  setPinned: (blockId: Id, pinned: boolean) => Promise<boolean>;
  setDone: (blockId: Id, done: boolean) => Promise<boolean>;
  /** Retorna a mensagem de erro, ou null se moveu. */
  moveBlock: (blockId: Id, date: IsoDate, start: number) => Promise<string | null>;
  dismissError: () => void;
}

export interface PlannerValue extends PlannerActions {
  status: 'loading' | 'ready' | 'error';
  /** true no modo demonstração (sem login). */
  readOnly: boolean;
  error: string | null;
  commitments: FixedCommitment[];
  tasks: Task[];
  blocks: PlanBlock[];
  alerts: PlanAlert[];
  settings: UserSettings;
}

export const PlannerContext = createContext<PlannerValue | null>(null);

export function usePlanner(): PlannerValue {
  const planner = useContext(PlannerContext);
  if (!planner) throw new Error('usePlanner precisa estar dentro de <PlannerProvider>');
  return planner;
}
