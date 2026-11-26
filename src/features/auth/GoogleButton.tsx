import { useState } from 'react';
import styles from './auth.module.css';
import { useSession } from '@/app/providers/SessionContext';
import { Alert } from '@/components/ui/Alert';
import { errorMessage } from '@/utils/errors';

/** RF01 — entrar ou criar conta com a conta Google. */
export function GoogleButton() {
  const { signInWithGoogle } = useSession();
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  return (
    <div className={styles.google}>
      {failure && <Alert tone="error">{failure}</Alert>}
      <button
        type="button"
        className={styles.googleButton}
        disabled={busy}
        aria-busy={busy || undefined}
        onClick={async () => {
          setBusy(true);
          setFailure(null);
          try {
            await signInWithGoogle();
          } catch (e) {
            setFailure(errorMessage(e));
          } finally {
            setBusy(false);
          }
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z" />
          <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
        </svg>
        Continuar com Google
      </button>
      <p className={styles.divider}>
        <span>ou com e-mail</span>
      </p>
    </div>
  );
}
