import { beforeEach, describe, expect, it } from 'vitest';
import { createMockServices, memoryStore } from '@/infra/mock';
import {
  moveBlock,
  recalculatePlan,
  setBlockDone,
  setBlockPinned,
  type AppServices,
} from '@/services';
import { NOW } from '../../helpers/fixtures';

let services: AppServices;

beforeEach(async () => {
  services = createMockServices({ store: memoryStore(), clock: () => new Date(2026, 10, 20, 8) });
  await services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });
  await services.settings.save({ dailyLimitMinutes: 180, windowStart: 480, windowEnd: 1320 });
});

describe('recalculatePlan (RF09)', () => {
  it('gera e salva o plano a partir dos repositórios', async () => {
    await services.tasks.create({ title: 'TCC', durationMinutes: 240, deadline: '2026-11-30', priority: 'alta' });
    const snapshot = await recalculatePlan(services, NOW);
    expect(snapshot.tasks).toHaveLength(1);
    expect(snapshot.blocks.length).toBeGreaterThan(0);
    expect(await services.blocks.list()).toEqual(snapshot.blocks);
  });

  it('remove os blocos quando a tarefa é excluída', async () => {
    const t = await services.tasks.create({ title: 'TCC', durationMinutes: 120, deadline: '2026-11-30', priority: 'alta' });
    await recalculatePlan(services, NOW);
    await services.tasks.remove(t.id);
    const snapshot = await recalculatePlan(services, NOW);
    expect(snapshot.blocks).toEqual([]);
  });
});

describe('ações de bloco', () => {
  async function firstBlock() {
    await services.tasks.create({ title: 'TCC', durationMinutes: 120, deadline: '2026-11-30', priority: 'alta' });
    const { blocks } = await recalculatePlan(services, NOW);
    return blocks[0]!;
  }

  it('fixar e concluir (RF07, RF08)', async () => {
    const block = await firstBlock();
    await setBlockPinned(services, block.id, true);
    await setBlockDone(services, block.id, true);
    const saved = (await services.blocks.list()).find((b) => b.id === block.id);
    expect(saved).toMatchObject({ pinned: true, done: true });
  });

  it('falha ao fixar bloco inexistente', async () => {
    await expect(setBlockPinned(services, 'nao-existe', true)).rejects.toThrow('Bloco não encontrado.');
  });

  it('mover para horário livre fixa o bloco e o recálculo o mantém (RF06, RN05)', async () => {
    const block = await firstBlock();
    const result = await moveBlock(services, block.id, '2026-11-25', 16 * 60, NOW);
    expect(result).toEqual({ ok: true });
    const { blocks } = await recalculatePlan(services, NOW);
    expect(new Set(blocks.map((b) => b.id)).size).toBe(blocks.length);
    expect(blocks.find((b) => b.id === block.id)).toMatchObject({
      date: '2026-11-25',
      start: 960,
      end: 960 + (block.end - block.start),
      pinned: true,
    });
  });

  it('mover para conflito é impedido (RN03)', async () => {
    await services.commitments.create({ title: 'Aula', weekdays: [3], start: 960, end: 1080 });
    const block = await firstBlock();
    const result = await moveBlock(services, block.id, '2026-11-25', 16 * 60, NOW);
    expect(result).toEqual({ ok: false, error: 'Esse horário conflita com um compromisso ou outro bloco.' });
  });

  it('mover bloco inexistente retorna erro', async () => {
    expect(await moveBlock(services, 'x', '2026-11-25', 600, NOW)).toEqual({ ok: false, error: 'Bloco não encontrado.' });
  });
});
