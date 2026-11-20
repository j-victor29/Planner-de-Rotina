import type { UserProfile } from '@/domain';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

/** RF01, RF13 — autenticação. Implementações: infra/mock e infra/firebase. */
export interface AuthService {
  getCurrentUser(): UserProfile | null;
  /** Retorna a função para cancelar a inscrição. */
  onAuthChange(listener: (user: UserProfile | null) => void): () => void;
  signUp(data: SignUpData): Promise<UserProfile>;
  signIn(email: string, password: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  deleteAccount(): Promise<void>;
}
