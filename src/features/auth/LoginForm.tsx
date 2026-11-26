import { useState, type FormEvent } from 'react';
import styles from './auth.module.css';
import { useSession } from '@/app/providers/SessionContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { validateSignIn } from '@/domain';
import page from '@/features/shared/page.module.css';
import { errorMessage } from '@/utils/errors';

export function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateSignIn(email, password);
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      {failure && <Alert tone="error">{failure}</Alert>}
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <TextField
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <button type="button" className={styles.forgot} onClick={onForgot}>
        Esqueci minha senha
      </button>
      <Button type="submit" block loading={busy}>
        Entrar
      </Button>
    </form>
  );
}
