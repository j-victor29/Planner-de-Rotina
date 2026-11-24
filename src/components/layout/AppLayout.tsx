import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { DemoBanner } from './DemoBanner';
import styles from './layout.module.css';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { usePlanner } from '@/app/providers/PlannerContext';
import { Alert } from '@/components/ui/Alert';
import { IconButton } from '@/components/ui/IconButton';
import { AuthModal } from '@/features/auth/AuthModal';

/** Estrutura de todas as páginas. */
export function AppLayout() {
  const { error, dismissError } = usePlanner();
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
