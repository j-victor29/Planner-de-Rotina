import { useState, type FormEvent } from 'react';
import { useSession } from '@/app/providers/SessionContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { PASSWORD_MIN_LENGTH, validateSignUp, type SignUpInput } from '@/domain';
import page from '@/features/shared/page.module.css';
import { errorMessage } from '@/utils/errors';

const EMPTY: SignUpInput = { name: '', email: '', password: '', confirmPassword: '' };

export function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const { signUp } = useSession();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof SignUpInput) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateSignUp(form);
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      await signUp({ name: form.name, email: form.email, password: form.password });
      onRegistered();
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={page.form} onSubmit={submit} noValidate>
      {failure && <Alert tone="error">{failure}</Alert>}
      <TextField label="Nome" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
      <TextField
        label="E-mail"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={set('email')}
        error={errors.email}
      />
      <TextField
        label="Senha"
        type="password"
        autoComplete="new-password"
        hint={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres.`}
        value={form.password}
        onChange={set('password')}
        error={errors.password}
      />
      <TextField
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={set('confirmPassword')}
        error={errors.confirmPassword}
      />
      <Button type="submit" block loading={busy}>
        Criar conta
      </Button>
    </form>
  );
}
