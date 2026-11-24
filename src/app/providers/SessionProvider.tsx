import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SessionContext, type AuthMode, type SessionValue } from './SessionContext';
import { useServices } from './ServicesContext';
import type { UserProfile } from '@/domain';

/** RF01 — estado de login e controle do modal de autenticação. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { auth } = useServices();
  const [user, setUser] = useState<UserProfile | null>(() => auth.getCurrentUser());
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  useEffect(() => auth.onAuthChange(setUser), [auth]);

  const value = useMemo<SessionValue>(
    () => ({
      user,
      authMode,
      openAuth: (mode = 'login') => setAuthMode(mode),
      closeAuth: () => setAuthMode(null),
      async signIn(email, password) {
        await auth.signIn(email, password);
        setAuthMode(null);
      },
      async signUp(data) {
        await auth.signUp(data);
        setAuthMode(null);
      },
      signOut: () => auth.signOut(),
      deleteAccount: () => auth.deleteAccount(),
    }),
    [auth, user, authMode],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
