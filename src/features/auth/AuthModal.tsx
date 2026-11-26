import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import { GoogleButton } from './GoogleButton';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ROUTES } from '@/app/routes';
import { useSession, type AuthMode } from '@/app/providers/SessionContext';
import { Modal } from '@/components/ui/Modal';

const TITLES: Record<AuthMode, string> = {
  login: 'Entrar',
  register: 'Criar conta',
  reset: 'Recuperar senha',
};

const LEADS: Record<AuthMode, string> = {
  login: 'Bem-vindo de volta! Entre para ver a sua semana.',
  register: 'Em 2 minutos o planner organiza a sua semana.',
  reset: 'Digite o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.',
};

/** RF01 — login, cadastro e recuperação de senha sem sair da página. */
export function AuthModal() {
  const { authMode, openAuth, closeAuth } = useSession();
  const navigate = useNavigate();
  const mode = authMode ?? 'login';

  return (
    <Modal open={authMode !== null} title={TITLES[mode]} onClose={closeAuth} size="sm">
      <p className={styles.lead}>{LEADS[mode]}</p>
      {mode !== 'reset' && <GoogleButton />}
      {mode === 'login' && <LoginForm onForgot={() => openAuth('reset')} />}
      {mode === 'register' && <RegisterForm onRegistered={() => navigate(ROUTES.onboarding)} />}
      {mode === 'reset' && <ResetPasswordForm />}
      <p className={styles.switch}>
        {mode === 'register' ? 'Já tem conta?' : mode === 'login' ? 'Ainda não tem conta?' : 'Lembrou a senha?'}{' '}
        <button type="button" onClick={() => openAuth(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </Modal>
  );
}
