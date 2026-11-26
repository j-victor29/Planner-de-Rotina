import { describe, expect, it } from 'vitest';
import {
  awakeIntervals,
  checkBlockPlacement,
  dailyLimitFor,
  freeIntervals,
  sleepIntervals,
  sleepMinutes,
  usedMinutes,
  type PlanBlock,
} from '@/domain';
import { commitment, NOW, SETTINGS } from '../../helpers/fixtures';

const block = (id: string, date: string, start: number, end: number): PlanBlock => ({
  id,
  taskId: 't',
  date,
  start,
  end,
  pinned: false,
  done: false,
});

const aula = commitment({ id: 'aula', start: 19 * 60, end: 21 * 60 });

describe('sono', () => {
  it('sono que atravessa a meia-noite', () => {
    const s = { sleepStart: 23 * 60, sleepEnd: 7 * 60 };
    expect(sleepMinutes(s)).toBe(480);
    expect(sleepIntervals(s)).toEqual([
      { start: 0, end: 420 },
      { start: 1380, end: 1440 },
    ]);
    expect(awakeIntervals(s)).toEqual([{ start: 420, end: 1380 }]);
  });

  it('sono no mesmo dia e dormir à meia-noite (24:00)', () => {
    expect(sleepIntervals({ sleepStart: 60, sleepEnd: 480 })).toEqual([{ start: 60, end: 480 }]);
    expect(awakeIntervals({ sleepStart: 1440, sleepEnd: 480 })).toEqual([{ start: 480, end: 1440 }]);
    expect(sleepIntervals({ sleepStart: 480, sleepEnd: 480 })).toEqual([]);
  });
});

describe('limite por dia', () => {
  it('fim de semana usa o limite próprio quando definido', () => {
    const settings = { ...SETTINGS, weekendLimitMinutes: 300 };
    expect(dailyLimitFor('2026-11-21', settings)).toBe(300); // sábado
    expect(dailyLimitFor('2026-11-20', settings)).toBe(180); // sexta
    expect(dailyLimitFor('2026-11-21', SETTINGS)).toBe(180);
  });
});

describe('freeIntervals', () => {
  it('dia de descanso não tem horário livre', () => {
    expect(freeIntervals('2026-11-22', { ...SETTINGS, restDays: [0] }, [], [])).toEqual([]);
  });

  it('reserva a pausa ao redor dos blocos', () => {
    const free = freeIntervals('2026-11-22', SETTINGS, [], [block('b', '2026-11-22', 600, 660)], 0, 30);
    expect(free).toEqual([
      { start: 480, end: 570 },
      { start: 690, end: 1320 },
    ]);
  });

  it('desconta compromissos e blocos dentro da janela', () => {
    const free = freeIntervals('2026-11-20', SETTINGS, [aula], [block('b', '2026-11-20', 600, 660)]);
    expect(free).toEqual([
      { start: 480, end: 600 },
      { start: 660, end: 1140 },
      { start: 1260, end: 1320 },
    ]);
  });

  it('ignora compromissos de outros dias da semana', () => {
    // 22/11/2026 é domingo; a aula é de segunda a sexta.
    expect(freeIntervals('2026-11-22', SETTINGS, [aula], [])).toEqual([{ start: 480, end: 1320 }]);
  });

  it('não devolve horários antes de fromMinute', () => {
    expect(freeIntervals('2026-11-22', SETTINGS, [], [], 1000)).toEqual([{ start: 1020, end: 1320 }]);
  });
});

describe('checkBlockPlacement (RF06)', () => {
  const blocks = [block('a', '2026-11-21', 600, 720), block('b', '2026-11-21', 840, 900)];
  const base = {
    blockId: 'a',
    date: '2026-11-21',
    now: NOW,
    commitments: [aula],
    blocks,
    settings: SETTINGS,
  };

  it('aceita horário livre', () => {
    expect(checkBlockPlacement({ ...base, start: 960, end: 1080 })).toBeNull();
    expect(usedMinutes('2026-11-21', blocks)).toBe(180);
  });

  it('rejeita conflito com outro bloco (RN03)', () => {
    expect(checkBlockPlacement({ ...base, start: 780, end: 900 })).toMatch(/conflita/);
  });

  it('rejeita conflito com compromisso fixo (RN03)', () => {
    expect(checkBlockPlacement({ ...base, date: '2026-11-23', start: 1110, end: 1170 })).toMatch(/conflita/);
  });

  it('rejeita horário no passado', () => {
    expect(checkBlockPlacement({ ...base, date: '2026-11-19', start: 600, end: 720 })).toMatch(/já passou/);
    expect(checkBlockPlacement({ ...base, date: '2026-11-20', start: 420, end: 450 })).toMatch(/já passou/);
  });

  it('rejeita horário de sono, dia de descanso e fora da grade', () => {
    expect(checkBlockPlacement({ ...base, start: 1260, end: 1380 })).toMatch(/sono/);
    expect(
      checkBlockPlacement({ ...base, date: '2026-11-22', settings: { ...SETTINGS, restDays: [0] }, start: 600, end: 660 }),
    ).toMatch(/descanso/);
    expect(checkBlockPlacement({ ...base, start: 610, end: 700 })).toMatch(/30 minutos/);
  });

  it('rejeita quando passa do limite diário (RN04)', () => {
    const full = [...blocks, block('c', '2026-11-21', 480, 570)];
    expect(
      checkBlockPlacement({ ...base, blocks: full, blockId: 'novo', start: 960, end: 1020 }),
    ).toMatch(/limite diário/);
  });
});
