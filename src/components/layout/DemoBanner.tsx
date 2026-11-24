import styles from './layout.module.css';
import { useSession } from '@/app/providers/SessionContext';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/** Aviso do modo demonstração (visitante sem login). */
export function DemoBanner() {
  const { user, openAuth } = useSession();
  if (user) return null;
  return (
    <div className={styles.demoBanner} role="note">
      <Icon name="sparkle" className={styles.demoIcon} />
      <p>
        <strong>Esta é uma semana de exemplo.</strong> Crie sua conta para o planner montar a sua.
      </p>
      <Button size="sm" onClick={() => openAuth('register')}>
        Começar grátis
      </Button>
    </div>
  );
}
