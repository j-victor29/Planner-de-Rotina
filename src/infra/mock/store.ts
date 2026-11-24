import type { FixedCommitment, PlanBlock, Task, UserSettings } from '@/domain';

export interface MockUserData {
  commitments: FixedCommitment[];
  tasks: Task[];
  blocks: PlanBlock[];
  settings: UserSettings;
}

export interface MockAccount {
  id: string;
  name: string;
  email: string;
  /** Só no mock: hash da senha para simular o login. O Firebase não expõe isso. */
  passwordHash: string;
}

export interface MockDatabase {
  accounts: Record<string, MockAccount>;
  sessionUserId: string | null;
  data: Record<string, MockUserData>;
}

export interface MockStore {
  read(): MockDatabase;
  write(db: MockDatabase): void;
}

export function emptyDatabase(): MockDatabase {
  return { accounts: {}, sessionUserId: null, data: {} };
}

/** Banco só em memória (testes e modo demonstração). */
export function memoryStore(initial: MockDatabase = emptyDatabase()): MockStore {
  let db = structuredClone(initial);
  return {
    read: () => db,
    write: (next) => {
      db = next;
    },
  };
}

/**
 * Banco em memória que também salva no localStorage, para os dados sobreviverem
 * ao recarregar a página na etapa 2. Se o navegador bloquear o armazenamento,
 * continua funcionando só em memória.
 */
export function browserStore(key: string): MockStore {
  let db = emptyDatabase();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) db = JSON.parse(raw) as MockDatabase;
  } catch {
    db = emptyDatabase();
  }
  return {
    read: () => db,
    write: (next) => {
      db = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Armazenamento indisponível: segue só em memória.
      }
    },
  };
}
