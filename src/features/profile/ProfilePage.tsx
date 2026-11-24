import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsForm } from './SettingsForm';
import { ROUTES } from '@/app/routes';
import { usePlanner } from '@/app/providers/PlannerContext';
import { useSession } from '@/app/providers/SessionContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import page from '@/features/shared/page.module.css';

/** RF11, RF12, RF13 — conta e preferências. */
export function ProfilePage() {
  const { user, openAuth, signOut, deleteAccount } = useSession();
  const planner = usePlanner();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    return (
      <>
        <PageHeader title="Perfil" />
        <div className={page.card}>
          <EmptyState
            icon="user"
            title="Entre para ver seu perfil"
            description="Aqui você define o limite de horas por dia e a janela de horário do seu plano."
            action={<Button onClick={() => openAuth('login')}>Entrar</Button>}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Perfil" description={user.email} />
      <div className={page.stack} style={{ maxWidth: 640 }}>
        <section className={page.cardPadded}>
          <h2 className={page.cardTitle}>Preferências do plano</h2>
          <p className={page.cardText}>Mudou sua disponibilidade? Ajuste aqui e o plano é refeito na hora.</p>
          {planner.status === 'loading' ? (
            <Spinner />
          ) : (
            <SettingsForm key={JSON.stringify(planner.settings)} value={planner.settings} onSubmit={planner.saveSettings} />
          )}
        </section>

        <section className={page.cardPadded}>
          <h2 className={page.cardTitle}>Conta</h2>
          <p className={page.cardText}>Conectado como {user.name}.</p>
          <div className={page.formActions} style={{ justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={() => setConfirmDelete(true)} style={{ color: 'var(--color-danger)' }}>
              Excluir conta
            </Button>
            <Button variant="secondary" icon="logout" onClick={() => void signOut()}>
              Sair
            </Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir sua conta?"
        message="Sua rotina, tarefas e plano serão apagados permanentemente. Essa ação não pode ser desfeita."
        confirmLabel="Excluir conta"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteAccount();
          setConfirmDelete(false);
          navigate(ROUTES.week);
        }}
      />
    </>
  );
}
