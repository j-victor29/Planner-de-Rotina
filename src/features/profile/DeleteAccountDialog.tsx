import { useState } from 'react';
import { useSession } from '@/app/providers/SessionContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TextField } from '@/components/ui/TextField';
import { errorMessage } from '@/utils/errors';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

/** RF13 — excluir a conta. O Firebase exige confirmar a identidade antes. */
export function DeleteAccountDialog({ open, onClose, onDeleted }: DeleteAccountDialogProps) {
  const { user, deleteAccount } = useSession();
  const [password, setPassword] = useState('');
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isGoogle = user?.provider === 'google';

  async function confirm() {
    setBusy(true);
    setFailure(null);
    try {
      await deleteAccount({ password: isGoogle ? undefined : password });
      onDeleted();
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Excluir sua conta?"
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="danger" loading={busy} onClick={() => void confirm()}>
            Excluir conta
          </Button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <p>Sua rotina, tarefas e plano serão apagados permanentemente. Essa ação não pode ser desfeita.</p>
        {failure && <Alert tone="error">{failure}</Alert>}
        {isGoogle ? (
          <p>Para confirmar, vamos pedir que você entre com o Google novamente.</p>
        ) : (
          <TextField
            label="Digite sua senha para confirmar"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
}
