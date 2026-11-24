import { useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/app/routes';
import { useSession } from '@/app/providers/SessionContext';

/** Páginas que exigem login: sem usuário, volta para a semana e abre o login. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, openAuth } = useSession();
  useEffect(() => {
    if (!user) openAuth('login');
  }, [user, openAuth]);
  if (!user) return <Navigate to={ROUTES.week} replace />;
  return <>{children}</>;
}
