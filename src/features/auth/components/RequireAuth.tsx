import type { ReactNode } from 'react';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Protege as páginas logadas. Etapa 3: redirecionar para /login quando
 * não houver usuário. Por enquanto deixa passar.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  return <>{children}</>;
}
