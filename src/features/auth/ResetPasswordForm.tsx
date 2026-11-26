import { useState, type FormEvent } from 'react';
import { useSession } from '@/app/providers/SessionContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { isValidEmail } from '@/domain';
import page from '@/features/shared/page.module.css';
import { errorMessage } from '@/utils/errors';

/** RF01 — recuperação de senha por e-mail (link enviado pelo Firebase). */
export function ResetPasswordForm() {
  const { sendPasswordReset } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [failure, setFailure] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFailure(null);
    if (!isValidEmail(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError(undefined);
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Alert tone="success" title="Confira seu e-mail">
        Se existir uma conta com {email.trim()}, enviamos um link para criar uma nova senha.
      </Alert>
    );
  }

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      {failure && <Alert tone="error">{failure}</Alert>}
      <TextField
        label="E-mail da conta"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button type="submit" block loading={busy}>
        Enviar link
      </Button>
    </form>
  );
}
