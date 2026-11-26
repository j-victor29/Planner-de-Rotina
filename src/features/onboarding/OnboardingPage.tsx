import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './onboarding.module.css';
import { ROUTES } from '@/app/routes';
import { usePlanner } from '@/app/providers/PlannerContext';
import { useSession } from '@/app/providers/SessionContext';
import { Brand } from '@/components/layout/Brand';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { formatTimeRange, WEEKDAY_SHORT } from '@/utils/format';
import { fromDraft, toDraft, type DraftErrors } from '@/features/profile/settingsDraft';
import { SettingsForm } from '@/features/profile/SettingsForm';
import { SleepFields } from '@/features/profile/SleepFields';
import { CommitmentForm } from '@/features/routine/CommitmentForm';
import page from '@/features/shared/page.module.css';
import { TaskForm } from '@/features/tasks/TaskForm';
import { cx } from '@/utils/cx';

const STEPS = ['Sua rotina', 'Preferências', 'Primeira tarefa'];

/**
 * RF15 — "Vamos montar a sua semana": tela cheia, sem menu. O usuário só sai
 * daqui ao concluir os três passos (ou saindo da conta). Pode voltar entre eles.
 */
export function OnboardingPage() {
  const { user, onboardingCompleted, completeOnboarding, signOut } = useSession();
  const planner = usePlanner();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  if (onboardingCompleted) {
    return (
      <>
        <Spinner label="Abrindo sua semana" />
        <Navigate to={ROUTES.week} replace />
      </>
    );
  }

  const leave = async () => {
    navigate(ROUTES.week, { replace: true });
    await signOut();
  };

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <Brand />
        <Button variant="ghost" size="sm" icon="logout" onClick={() => void leave()}>
          Sair
        </Button>
      </header>

      <main className={styles.main}>
        <div>
          <p className={styles.eyebrow}>Olá, {user?.name.split(' ')[0]}!</p>
          <h1 className={styles.title}>Vamos montar a sua semana</h1>
        </div>

        <ol className={styles.steps} aria-label="Etapas">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={cx(styles.step, index === step && styles.stepCurrent, index < step && styles.stepDone)}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className={styles.stepNumber}>{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {planner.status === 'loading' ? (
          <Spinner />
        ) : (
          <>
            {step === 0 && <RoutineStep onNext={() => setStep(1)} />}

            {step === 1 && (
              <section className={page.cardPadded}>
                <h2 className={page.cardTitle}>Como você quer trabalhar?</h2>
                <p className={page.cardText}>O plano nunca passa do seu limite e respeita seus dias de descanso.</p>
                <SettingsForm
                  value={planner.settings}
                  showSleep={false}
                  showSaved={false}
                  submitLabel="Continuar"
                  extraActions={
                    <Button variant="secondary" onClick={() => setStep(0)}>
                      Voltar
                    </Button>
                  }
                  onSubmit={async (settings) => {
                    const ok = await planner.saveSettings(settings);
                    if (ok) setStep(2);
                    return ok;
                  }}
                />
              </section>
            )}

            {step === 2 && (
              <section className={page.cardPadded}>
                <h2 className={page.cardTitle}>O que você precisa entregar?</h2>
                <p className={page.cardText}>
                  Diga quanto tempo leva e o prazo. O planner distribui em blocos até a data.
                </p>
                <TaskForm
                  submitLabel="Criar e ver minha semana"
                  cancelLabel="Voltar"
                  onCancel={() => setStep(1)}
                  onSubmit={async (input) => {
                    const ok = await planner.createTask(input);
                    if (ok) {
                      await completeOnboarding();
                      navigate(ROUTES.week, { replace: true });
                    }
                    return ok;
                  }}
                />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/** Passo 1: sono + compromissos fixos. */
function RoutineStep({ onNext }: { onNext: () => void }) {
  const planner = usePlanner();
  const initial = toDraft(planner.settings);
  const [bedtime, setBedtime] = useState(initial.bedtime);
  const [wake, setWake] = useState(initial.wake);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [busy, setBusy] = useState(false);

  async function next() {
    const result = fromDraft({ ...toDraft(planner.settings), bedtime, wake });
    setErrors(result.errors);
    if (!result.settings) return;
    setBusy(true);
    const ok = await planner.saveSettings(result.settings);
    setBusy(false);
    if (ok) onNext();
  }

  return (
    <>
      <section className={page.cardPadded}>
        <h2 className={page.cardTitle}>Seu sono</h2>
        <p className={page.cardText}>O planner nunca coloca tarefas no seu horário de sono.</p>
        <SleepFields bedtime={bedtime} wake={wake} onBedtime={setBedtime} onWake={setWake} errors={errors} />
      </section>

      <section className={page.cardPadded}>
        <h2 className={page.cardTitle}>Seus compromissos fixos</h2>
        <p className={page.cardText}>Aula, trabalho, estágio… Esses horários ficam bloqueados toda semana.</p>
        {planner.commitments.length > 0 && (
          <ul className={styles.added}>
            {planner.commitments.map((c) => (
              <li key={c.id}>
                <span>
                  <strong>{c.title}</strong> · {c.weekdays.map((d) => WEEKDAY_SHORT[d]).join(', ')} ·{' '}
                  {formatTimeRange(c.start, c.end)}
                </span>
                <IconButton icon="trash" label={`Remover ${c.title}`} onClick={() => void planner.deleteCommitment(c.id)} />
              </li>
            ))}
          </ul>
        )}
        <CommitmentForm
          key={planner.commitments.length}
          submitLabel="Adicionar compromisso"
          onSubmit={(input) => planner.createCommitment(input)}
        />
      </section>

      <div className={styles.footer}>
        <Button onClick={() => void next()} loading={busy}>
          Continuar
        </Button>
      </div>
    </>
  );
}
