import type { DataServices } from './AppServices';
import {
  checkBlockPlacement,
  generatePlan,
  type FixedCommitment,
  type Id,
  type IsoDate,
  type IsoDateTime,
  type PlanAlert,
  type PlanBlock,
  type Task,
  type UserSettings,
} from '@/domain';

/** Tudo o que a interface precisa para desenhar o planejamento. */
export interface PlannerSnapshot {
  commitments: FixedCommitment[];
  tasks: Task[];
  settings: UserSettings;
  blocks: PlanBlock[];
  alerts: PlanAlert[];
}

/**
 * RF04 / RF09 — lê os dados, gera o plano (domínio puro) e salva os blocos.
 * Chamado depois de qualquer mudança.
 */
export async function recalculatePlan(
  services: DataServices,
  now: IsoDateTime,
): Promise<PlannerSnapshot> {
  const [commitments, tasks, existingBlocks, settings] = await Promise.all([
    services.commitments.list(),
    services.tasks.list(),
    services.blocks.list(),
    services.settings.get(),
  ]);
  const { blocks, alerts } = generatePlan({ now, commitments, tasks, existingBlocks, settings });
  await services.blocks.replaceAll(blocks);
  return { commitments, tasks, settings, blocks, alerts };
}

async function findBlock(services: DataServices, blockId: Id): Promise<PlanBlock> {
  const block = (await services.blocks.list()).find((b) => b.id === blockId);
  if (!block) throw new Error('Bloco não encontrado.');
  return block;
}

/** RF07 — fixa ou desfixa um bloco. */
export async function setBlockPinned(
  services: DataServices,
  blockId: Id,
  pinned: boolean,
): Promise<void> {
  const block = await findBlock(services, blockId);
  await services.blocks.update({ ...block, pinned });
}

/** RF08 — marca ou desmarca um bloco como concluído. */
export async function setBlockDone(
  services: DataServices,
  blockId: Id,
  done: boolean,
): Promise<void> {
  const block = await findBlock(services, blockId);
  await services.blocks.update({ ...block, done });
}

export type MoveResult = { ok: true } | { ok: false; error: string };

/**
 * RF06 — move um bloco para outro dia/horário, mantendo a duração.
 * O bloco movido fica fixado, para o recálculo não desfazer a escolha do usuário.
 */
export async function moveBlock(
  services: DataServices,
  blockId: Id,
  date: IsoDate,
  start: number,
  now: IsoDateTime,
): Promise<MoveResult> {
  const [blocks, commitments, settings] = await Promise.all([
    services.blocks.list(),
    services.commitments.list(),
    services.settings.get(),
  ]);
  const block = blocks.find((b) => b.id === blockId);
  if (!block) return { ok: false, error: 'Bloco não encontrado.' };

  const end = start + (block.end - block.start);
  const error = checkBlockPlacement({
    blockId,
    date,
    start,
    end,
    now,
    commitments,
    blocks,
    settings,
  });
  if (error) return { ok: false, error };

  await services.blocks.update({ ...block, date, start, end, pinned: true });
  return { ok: true };
}
