import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ROUTES } from '@/app/routes';
import { useSession } from '@/app/providers/SessionContext';
import { Modal } from '@/components/ui/Modal';

/** RF01 — login e cadastro sem sair da página. */
export function AuthModal() {
  const { authMode, openAuth, closeAuth } = useSession();
  const navigate = useNavigate();
  const isLogin = authMode === 'login';

  return (
    <Modal open={authMode !== null} title={isLogin ? 'Entrar' : 'Criar conta'} onClose={closeAuth} size="sm">
      <p className={styles.lead}>
        {isLogin
          ? 'Bem-vindo de volta! Entre para ver a sua semana.'
          : 'Em 2 minutos o planner organiza a sua semana.'}
      </p>
      {isLogin ? (
        <LoginForm />
      ) : (
        <RegisterForm onRegistered={() => navigate(ROUTES.onboarding)} />
      )}
      <p className={styles.switch}>
        {isLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
        <button type="button" onClick={() => openAuth(isLogin ? 'register' : 'login')}>
          {isLogin ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </Modal>
  );
}
