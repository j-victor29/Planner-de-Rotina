import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SessionContext, type AuthMode, type SessionValue } from './SessionContext';
import { useServices } from './ServicesContext';
import { Spinner } from '@/components/ui/Spinner';
import type { UserProfile } from '@/domain';

interface OnboardingState {
  userId: string;
  completed: boolean;
}

/** RF01, RF15 — estado de login, passo a passo e modal de autenticação. */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { auth, profile } = useServices();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);

  // O Firebase restaura a sessão de forma assíncrona: espera a primeira resposta.
  useEffect(
    () =>
      auth.onAuthChange((next) => {
        setUser(next);
        setAuthReady(true);
      }),
    [auth],
  );

  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let active = true;
    profile
      .get()
      .then((p) => active && setOnboarding({ userId, completed: p.onboardingCompleted }))
      .catch(() => active && setOnboarding({ userId, completed: true }));
    return () => {
      active = false;
    };
  }, [profile, userId]);

  const onboardingCompleted = userId && onboarding?.userId === userId ? onboarding.completed : null;

  const value = useMemo<SessionValue>(
    () => ({
      user,
      onboardingCompleted,
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
      async signInWithGoogle() {
        await auth.signInWithGoogle();
        setAuthMode(null);
      },
      sendPasswordReset: (email) => auth.sendPasswordReset(email),
      signOut: () => auth.signOut(),
      deleteAccount: (reauth) => auth.deleteAccount(reauth),
      async completeOnboarding() {
        await profile.completeOnboarding();
        if (userId) setOnboarding({ userId, completed: true });
      },
    }),
    [auth, profile, user, userId, onboardingCompleted, authMode],
  );

  if (!authReady) return <Spinner label="Carregando" />;
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
