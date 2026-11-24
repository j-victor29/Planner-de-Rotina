import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import styles from './layout.module.css';
import { ROUTES } from '@/app/routes';
import { useSession } from '@/app/providers/SessionContext';
import { Button } from '@/components/ui/Button';
import { initials } from '@/utils/format';

/** Barra superior (celular). */
export function TopBar() {
  const { user, openAuth } = useSession();
  return (
    <header className={styles.topBar}>
      <Brand />
      {user ? (
        <Link to={ROUTES.profile} className={styles.avatar} aria-label={`Perfil de ${user.name}`}>
          {initials(user.name)}
        </Link>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => openAuth('login')}>
          Entrar
        </Button>
      )}
    </header>
  );
}
