import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import { ROUTES } from '@/app/routes';
import { usePlanner } from '@/app/providers/PlannerContext';
import { useSession } from '@/app/providers/SessionContext';
import { Button } from '@/components/ui/Button';
import { formatMinute } from '@/domain';
import { CommitmentForm } from '@/features/routine/CommitmentForm';
import { SettingsForm } from '@/features/profile/SettingsForm';
import page from '@/features/shared/page.module.css';
import { TaskForm } from '@/features/tasks/TaskForm';
import { cx } from '@/utils/cx';
import { WEEKDAY_SHORT } from '@/utils/format';

const STEPS = ['Sua rotina', 'Preferências', 'Primeira tarefa'];

/** Passo a passo depois do cadastro: rotina → preferências → primeira tarefa. */
export function OnboardingPage() {
  const { user } = useSession();
  const planner = usePlanner();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const finish = () => navigate(ROUTES.week);

  return (
    <div className={styles.onboarding}>
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

      <section className={page.cardPadded}>
        {step === 0 && (
          <>
            <h2 className={page.cardTitle}>Quais horários já estão ocupados?</h2>
            <p className={page.cardText}>
              Cadastre aula, trabalho, estágio… Esses horários ficam bloqueados no plano.
            </p>
            {planner.commitments.length > 0 && (
              <ul className={styles.addedList}>
                {planner.commitments.map((c) => (
                  <li key={c.id}>
                    <strong>{c.title}</strong> · {c.weekdays.map((d) => WEEKDAY_SHORT[d]).join(', ')} ·{' '}
                    {formatMinute(c.start)}–{formatMinute(c.end)}
                  </li>
                ))}
              </ul>
            )}
            <CommitmentForm
              key={planner.commitments.length}
              submitLabel="Adicionar compromisso"
              onSubmit={(input) => planner.createCommitment(input)}
            />
            <div className={styles.stepFooter}>
              <Button variant="ghost" onClick={() => setStep(1)}>
                {planner.commitments.length > 0 ? 'Continuar' : 'Pular por enquanto'}
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className={page.cardTitle}>Quanto você quer trabalhar por dia?</h2>
            <p className={page.cardText}>
              O plano nunca passa do seu limite diário nem sai da sua janela de horário.
            </p>
            <SettingsForm
              value={planner.settings}
              submitLabel="Salvar e continuar"
              onSubmit={async (settings) => {
                const ok = await planner.saveSettings(settings);
                if (ok) setStep(2);
                return ok;
              }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={page.cardTitle}>O que você precisa entregar?</h2>
            <p className={page.cardText}>
              Informe quanto tempo leva e o prazo. O planner distribui em blocos até a data.
            </p>
            <TaskForm
              submitLabel="Criar e ver minha semana"
              onSubmit={async (input) => {
                const ok = await planner.createTask(input);
                if (ok) finish();
                return ok;
              }}
            />
            <div className={styles.stepFooter}>
              <Button variant="ghost" onClick={finish}>
                Pular e ir para a semana
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
