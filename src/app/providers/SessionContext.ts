import { createContext, useContext } from 'react';
import type { UserProfile } from '@/domain';
import type { SignUpData } from '@/services';

export type AuthMode = 'login' | 'register';

export interface SessionValue {
  user: UserProfile | null;
  /** Modal de login/cadastro aberto (ou null). */
  authMode: AuthMode | null;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return session;
}
