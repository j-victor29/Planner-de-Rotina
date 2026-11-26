import { Navigate, Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { DemoBanner } from './DemoBanner';
import styles from './layout.module.css';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { usePlanner } from '@/app/providers/PlannerContext';
import { useSession } from '@/app/providers/SessionContext';
import { ROUTES } from '@/app/routes';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { IconButton } from '@/components/ui/IconButton';
import { AuthModal } from '@/features/auth/AuthModal';

/** Estrutura de todas as páginas. */
export function AppLayout() {
  const { error, dismissError } = usePlanner();
  const { user, onboardingCompleted } = useSession();

  // RF15 — quem ainda não montou a semana só pode ficar no passo a passo.
  if (user && onboardingCompleted === null) return <Spinner label="Carregando sua conta" />;
  if (user && onboardingCompleted === false) {
    return (
      <>
        <Spinner label="Abrindo o passo a passo" />
        <Navigate to={ROUTES.onboarding} replace />
      </>
    );
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <DemoBanner />
        {error && (
          <div className={styles.globalError}>
            <Alert
              tone="error"
              title="Não foi possível concluir"
              action={<IconButton icon="close" label="Fechar aviso" onClick={dismissError} />}
            >
              {error}
            </Alert>
          </div>
        )}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <AuthModal />
    </div>
  );
}
