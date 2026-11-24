import {
  DEFAULT_SETTINGS,
  fromJsDate,
  type FixedCommitment,
  type Id,
  type PlanBlock,
  type Task,
  type UserProfile,
  type UserSettings,
} from '@/domain';
import type { AppServices } from '@/services/AppServices';
import type { AuthService, SignUpData } from '@/services/contracts';
import { browserStore, type MockDatabase, type MockStore, type MockUserData } from './store';

export interface MockOptions {
  store?: MockStore;
  clock?: () => Date;
}

let idCounter = 0;
function newId(): Id {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `id-${Date.now().toString(36)}-${idCounter}`;
}

async function hashPassword(password: string): Promise<string> {
  const subtle = typeof crypto !== 'undefined' ? crypto.subtle : undefined;
  if (subtle) {
    const digest = await subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let hash = 2166136261;
  for (const char of password) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16);
}

function emptyUserData(): MockUserData {
  return { commitments: [], tasks: [], blocks: [], settings: { ...DEFAULT_SETTINGS } };
}

const clone = <T>(value: T): T => structuredClone(value);

/**
 * Implementação em memória de todos os serviços (etapa 2 e testes).
 * Segue exatamente os contratos de `services/contracts`, então a troca pelo
 * Firebase na etapa 3 não muda a interface.
 */
export function createMockServices(options: MockOptions = {}): AppServices {
  const store = options.store ?? browserStore('planner-de-rotina:mock-db');
  const clock = options.clock ?? (() => new Date());
  const listeners = new Set<(user: UserProfile | null) => void>();

  const read = () => store.read();
  const commit = (mutate: (db: MockDatabase) => void) => {
    const db = clone(read());
    mutate(db);
    store.write(db);
  };

  const profileOf = (db: MockDatabase, userId: string | null): UserProfile | null => {
    if (!userId) return null;
    const account = Object.values(db.accounts).find((a) => a.id === userId);
    return account ? { id: account.id, name: account.name, email: account.email } : null;
  };

  const notify = () => {
    const db = read();
    const user = profileOf(db, db.sessionUserId);
    listeners.forEach((listener) => listener(user));
  };

  const requireUserId = (): string => {
    const userId = read().sessionUserId;
    if (!userId) throw new Error('Usuário não autenticado.');
    return userId;
  };

  /** Lê ou altera os dados do usuário logado (isolamento entre contas). */
  const userData = (): MockUserData => {
    const db = read();
    return clone(db.data[requireUserId()] ?? emptyUserData());
  };
  const updateUserData = (mutate: (data: MockUserData) => void) => {
    const userId = requireUserId();
    commit((db) => {
      const data = db.data[userId] ?? emptyUserData();
      mutate(data);
      db.data[userId] = data;
    });
  };

  const auth: AuthService = {
    getCurrentUser: () => {
      const db = read();
      return profileOf(db, db.sessionUserId);
    },
    onAuthChange(listener) {
      listeners.add(listener);
      listener(auth.getCurrentUser());
      return () => listeners.delete(listener);
    },
    async signUp({ name, email, password }: SignUpData) {
      const key = email.trim().toLowerCase();
      if (read().accounts[key]) throw new Error('Já existe uma conta com este e-mail.');
      const account = {
        id: newId(),
        name: name.trim(),
        email: key,
        passwordHash: await hashPassword(password),
      };
      commit((db) => {
        db.accounts[key] = account;
        db.data[account.id] = emptyUserData();
        db.sessionUserId = account.id;
      });
      notify();
      return { id: account.id, name: account.name, email: account.email };
    },
    async signIn(email, password) {
      const account = read().accounts[email.trim().toLowerCase()];
      if (!account || account.passwordHash !== (await hashPassword(password))) {
        throw new Error('E-mail ou senha inválidos.');
      }
      commit((db) => {
        db.sessionUserId = account.id;
      });
      notify();
      return { id: account.id, name: account.name, email: account.email };
    },
    async signOut() {
      commit((db) => {
        db.sessionUserId = null;
      });
      notify();
    },
    async deleteAccount() {
      const userId = requireUserId();
      commit((db) => {
        for (const [key, account] of Object.entries(db.accounts)) {
          if (account.id === userId) delete db.accounts[key];
        }
        delete db.data[userId];
        db.sessionUserId = null;
      });
      notify();
    },
  };

  const findIndex = <T extends { id: Id }>(items: T[], id: Id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Registro não encontrado.');
    return index;
  };

  return {
    auth,
    commitments: {
      list: async () => userData().commitments,
      async create(input) {
        const item: FixedCommitment = { ...clone(input), id: newId() };
        updateUserData((data) => data.commitments.push(item));
        return clone(item);
      },
      async update(id, input) {
        const item: FixedCommitment = { ...clone(input), id };
        updateUserData((data) => {
          data.commitments[findIndex(data.commitments, id)] = item;
        });
        return clone(item);
      },
      async remove(id) {
        updateUserData((data) => {
          data.commitments = data.commitments.filter((c) => c.id !== id);
        });
      },
    },
    tasks: {
      list: async () => userData().tasks,
      async create(input) {
        const item: Task = { ...clone(input), id: newId(), createdAt: fromJsDate(clock()) };
        updateUserData((data) => data.tasks.push(item));
        return clone(item);
      },
      async update(id, input) {
        const current = userData().tasks.find((t) => t.id === id);
        if (!current) throw new Error('Registro não encontrado.');
        const item: Task = { ...current, ...clone(input), id };
        updateUserData((data) => {
          data.tasks[findIndex(data.tasks, id)] = item;
        });
        return clone(item);
      },
      async remove(id) {
        updateUserData((data) => {
          data.tasks = data.tasks.filter((t) => t.id !== id);
          data.blocks = data.blocks.filter((b) => b.taskId !== id);
        });
      },
    },
    blocks: {
      list: async () => userData().blocks,
      async replaceAll(blocks: PlanBlock[]) {
        updateUserData((data) => {
          data.blocks = clone(blocks);
        });
      },
      async update(block) {
        updateUserData((data) => {
          data.blocks[findIndex(data.blocks, block.id)] = clone(block);
        });
        return clone(block);
      },
    },
    settings: {
      get: async () => userData().settings,
      async save(settings: UserSettings) {
        updateUserData((data) => {
          data.settings = clone(settings);
        });
        return clone(settings);
      },
    },
  };
}
