import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { PreferencesSummary } from './PreferencesSummary';
import { SettingsForm } from './SettingsForm';
import { ROUTES } from '@/app/routes';
import { usePlanner } from '@/app/providers/PlannerContext';
import { useSession } from '@/app/providers/SessionContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { DemoCta } from '@/features/shared/DemoCta';
import page from '@/features/shared/page.module.css';

/** RF11, RF12, RF13 — conta e preferências. */
export function ProfilePage() {
  const { user, signOut } = useSession();
  const planner = usePlanner();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  if (!user) {
    return (
      <>
        <PageHeader title="Perfil" description="Seu sono, limite de horas e dias de descanso." />
        <div className={page.stack} style={{ maxWidth: 640 }}>
          <DemoCta
            title="Quer um plano feito para o seu ritmo?"
            text="Crie sua conta e conte quando você dorme, quantas horas quer trabalhar por dia e qual é o seu dia de descanso."
          />
          <section className={page.cardPadded}>
            <h2 className={page.cardTitle}>Preferências do exemplo</h2>
            <p className={page.cardText}>É assim que a semana de demonstração foi montada.</p>
            <PreferencesSummary settings={planner.settings} />
          </section>
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
          <p className={page.cardText}>Mudou sua rotina? Ajuste aqui e o plano é refeito na hora.</p>
          {planner.status === 'loading' ? (
            <Spinner />
          ) : (
            <SettingsForm key={JSON.stringify(planner.settings)} value={planner.settings} onSubmit={planner.saveSettings} />
          )}
        </section>

        <section className={page.cardPadded}>
          <h2 className={page.cardTitle}>Conta</h2>
          <p className={page.cardText}>
            Conectado como {user.name}
            {user.provider === 'google' ? ' (conta Google)' : ''}.
          </p>
          <div className={page.formActions} style={{ justifyContent: 'space-between' }}>
            <Button variant="ghost" onClick={() => setDeleting(true)} style={{ color: 'var(--color-danger)' }}>
              Excluir conta
            </Button>
            <Button variant="secondary" icon="logout" onClick={() => void signOut()}>
              Sair
            </Button>
          </div>
        </section>
      </div>

      <DeleteAccountDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onDeleted={() => {
          setDeleting(false);
          navigate(ROUTES.week);
        }}
      />
    </>
  );
}
