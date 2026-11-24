import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PlannerContext, type PlannerActions, type PlannerValue } from './PlannerContext';
import { useServices } from './ServicesContext';
import { useSession } from './SessionContext';
import { DEFAULT_SETTINGS, fromJsDate } from '@/domain';
import { createDemoServices } from '@/infra/mock';
import {
  moveBlock,
  recalculatePlan,
  setBlockDone,
  setBlockPinned,
  type DataServices,
  type PlannerSnapshot,
} from '@/services';
import { errorMessage } from '@/utils/errors';

interface LoadedState {
  /** Fonte de dados que gerou o snapshot (para saber se está desatualizado). */
  source: DataServices | null;
  snapshot: PlannerSnapshot | null;
  failed: boolean;
}

const nowText = () => fromJsDate(new Date());

/**
 * Estado do planejamento para toda a interface. Sem login usa os dados da
 * demonstração (somente leitura). A cada mudança recalcula o plano (RF09).
 */
export function PlannerProvider({
  demoServices,
  children,
}: {
  demoServices?: DataServices;
  children: ReactNode;
}) {
  const services = useServices();
  const { user, openAuth } = useSession();
  const demo = useMemo(() => demoServices ?? createDemoServices(), [demoServices]);
  const readOnly = user === null;
  const data: DataServices = readOnly ? demo : services;

  const [loaded, setLoaded] = useState<LoadedState>({ source: null, snapshot: null, failed: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    recalculatePlan(data, nowText())
      .then((snapshot) => {
        if (active) setLoaded({ source: data, snapshot, failed: false });
      })
      .catch((e: unknown) => {
        if (!active) return;
        setLoaded({ source: data, snapshot: null, failed: true });
        setError(errorMessage(e));
      });
    return () => {
      active = false;
    };
  }, [data]);

  const refresh = useCallback(async () => {
    const snapshot = await recalculatePlan(data, nowText());
    setLoaded({ source: data, snapshot, failed: false });
  }, [data]);

  const ensureAccess = useCallback(() => {
    if (!readOnly) return true;
    openAuth('register');
    return false;
  }, [readOnly, openAuth]);

  const run = useCallback(
    async (operation: () => Promise<unknown>): Promise<boolean> => {
      if (!ensureAccess()) return false;
      try {
        await operation();
        await refresh();
        return true;
      } catch (e) {
        setError(errorMessage(e));
        return false;
      }
    },
    [ensureAccess, refresh],
  );

  const actions = useMemo<PlannerActions>(
    () => ({
      ensureAccess,
      createTask: (input) => run(() => data.tasks.create(input)),
      updateTask: (id, input) => run(() => data.tasks.update(id, input)),
      deleteTask: (id) => run(() => data.tasks.remove(id)),
      createCommitment: (input) => run(() => data.commitments.create(input)),
      updateCommitment: (id, input) => run(() => data.commitments.update(id, input)),
      deleteCommitment: (id) => run(() => data.commitments.remove(id)),
      saveSettings: (settings) => run(() => data.settings.save(settings)),
      setPinned: (blockId, pinned) => run(() => setBlockPinned(data, blockId, pinned)),
      setDone: (blockId, done) => run(() => setBlockDone(data, blockId, done)),
      async moveBlock(blockId, date, start) {
        if (!ensureAccess()) return 'Entre na sua conta para editar o plano.';
        try {
          const result = await moveBlock(data, blockId, date, start, nowText());
          if (!result.ok) return result.error;
          await refresh();
          return null;
        } catch (e) {
          return errorMessage(e);
        }
      },
      dismissError: () => setError(null),
    }),
    [data, ensureAccess, refresh, run],
  );

  const current = loaded.source === data ? loaded : null;
  const snapshot = current?.snapshot ?? null;
  const value: PlannerValue = {
    ...actions,
    status: current === null ? 'loading' : current.failed ? 'error' : 'ready',
    readOnly,
    error,
    commitments: snapshot?.commitments ?? [],
    tasks: snapshot?.tasks ?? [],
    blocks: snapshot?.blocks ?? [],
    alerts: snapshot?.alerts ?? [],
    settings: snapshot?.settings ?? { ...DEFAULT_SETTINGS },
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}
