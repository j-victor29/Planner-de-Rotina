import { Link } from 'react-router-dom';
import styles from './layout.module.css';
import { ROUTES } from '@/app/routes';
import { useSession } from '@/app/providers/SessionContext';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { initials } from '@/utils/format';

/** Rodapé do menu lateral: usuário logado ou botões de entrar. */
export function UserArea() {
  const { user, openAuth, signOut } = useSession();
  if (!user) {
    return (
      <div className={styles.userArea}>
        <Button block onClick={() => openAuth('register')}>
          Criar conta
        </Button>
        <Button block variant="secondary" onClick={() => openAuth('login')}>
          Entrar
        </Button>
      </div>
    );
  }
  return (
    <div className={styles.userCard}>
      <Link to={ROUTES.profile} className={styles.userLink}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(user.name)}
        </span>
        <span className={styles.userText}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </span>
      </Link>
      <IconButton icon="logout" label="Sair" onClick={() => void signOut()} />
    </div>
  );
}
