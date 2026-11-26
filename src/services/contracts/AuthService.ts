import type { UserProfile } from '@/domain';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

/** Confirmação de identidade exigida antes de ações sensíveis (ex.: excluir conta). */
export interface Reauthentication {
  /** Senha atual (contas com e-mail e senha). Contas Google confirmam pelo Google. */
  password?: string;
}

/** RF01, RF13 — autenticação. Implementações: infra/mock e infra/firebase. */
export interface AuthService {
  getCurrentUser(): UserProfile | null;
  /** Avisa sempre que o usuário muda. Retorna a função para cancelar. */
  onAuthChange(listener: (user: UserProfile | null) => void): () => void;
  signUp(data: SignUpData): Promise<UserProfile>;
  signIn(email: string, password: string): Promise<UserProfile>;
  signInWithGoogle(): Promise<UserProfile>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  deleteAccount(reauth: Reauthentication): Promise<void>;
}
