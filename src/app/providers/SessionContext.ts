import { createContext, useContext } from 'react';
import type { UserProfile } from '@/domain';
import type { Reauthentication, SignUpData } from '@/services';

export type AuthMode = 'login' | 'register' | 'reset';

export interface SessionValue {
  user: UserProfile | null;
  /** RF15 — null enquanto carrega (ou sem usuário). */
  onboardingCompleted: boolean | null;
  /** Modal de login/cadastro aberto (ou null). */
  authMode: AuthMode | null;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: (reauth: Reauthentication) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return session;
}
