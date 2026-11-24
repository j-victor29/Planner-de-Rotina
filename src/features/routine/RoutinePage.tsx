import { useState } from 'react';
import { CommitmentForm } from './CommitmentForm';
import { usePlanner } from '@/app/providers/PlannerContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { formatDuration, type FixedCommitment, type Weekday } from '@/domain';
import page from '@/features/shared/page.module.css';
import { formatTimeRange, WEEKDAY_LETTER, WEEKDAY_LONG } from '@/utils/format';

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

/** RF02 — rotina fixa: compromissos que bloqueiam horários toda semana. */
export function RoutinePage() {
  const planner = usePlanner();
  const [editing, setEditing] = useState<FixedCommitment | 'new' | null>(null);
  const [deleting, setDeleting] = useState<FixedCommitment | null>(null);

  const open = (value: FixedCommitment | 'new') => {
    if (planner.ensureAccess()) setEditing(value);
  };
  const sorted = [...planner.commitments].sort((a, b) => a.start - b.start || a.title.localeCompare(b.title));

  return (
    <>
      <PageHeader
        title="Rotina fixa"
        description="Horários que se repetem toda semana e ficam bloqueados no plano."
        actions={
          <Button icon="plus" onClick={() => open('new')}>
            Novo compromisso
          </Button>
        }
      />

      {planner.status === 'loading' ? (
        <Spinner />
      ) : sorted.length === 0 ? (
        <div className={page.card}>
          <EmptyState
            icon="repeat"
            title="Nenhum compromisso fixo"
            description="Cadastre aula, trabalho ou estágio para o planner saber quando você está ocupado."
            action={<Button onClick={() => open('new')}>Cadastrar compromisso</Button>}
          />
        </div>
      ) : (
        <ul className={`${page.list} ${page.listGrid}`}>
          {sorted.map((c) => (
            <li key={c.id} className={page.item}>
              <div className={page.itemMain}>
                <span className={page.itemTitle}>{c.title}</span>
                <span className={page.itemMeta}>
                  <span className={page.metaItem}>
                    <Icon name="clock" size={16} /> {formatTimeRange(c.start, c.end)} · {formatDuration(c.end - c.start)}
                  </span>
                </span>
                <span className={page.chips} aria-label={`Dias: ${c.weekdays.map((d) => WEEKDAY_LONG[d]).join(', ')}`}>
                  {ALL_DAYS.map((d) => (
                    <span key={d} className={c.weekdays.includes(d) ? page.chipOn : page.chip} aria-hidden="true">
                      {WEEKDAY_LETTER[d]}
                    </span>
                  ))}
                </span>
              </div>
              <div className={page.itemActions}>
                <IconButton icon="edit" label={`Editar ${c.title}`} onClick={() => open(c)} />
                <IconButton
                  icon="trash"
                  label={`Excluir ${c.title}`}
                  onClick={() => planner.ensureAccess() && setDeleting(c)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'Novo compromisso fixo' : 'Editar compromisso'}
        onClose={() => setEditing(null)}
      >
        {editing !== null && (
          <CommitmentForm
            initialValue={editing === 'new' ? undefined : editing}
            submitLabel={editing === 'new' ? 'Adicionar' : 'Salvar'}
            onCancel={() => setEditing(null)}
            onSubmit={async (input) => {
              const ok =
                editing === 'new'
                  ? await planner.createCommitment(input)
                  : await planner.updateCommitment(editing.id, input);
              if (ok) setEditing(null);
              return ok;
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Excluir compromisso?"
        message={`"${deleting?.title ?? ''}" deixará de bloquear seus horários e o plano será recalculado.`}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await planner.deleteCommitment(deleting.id);
          setDeleting(null);
        }}
      />
    </>
  );
}
