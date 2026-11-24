import { describe, expect, it } from 'vitest';
import {
  blockMinutes,
  generatePlan,
  overlaps,
  RULES,
  weekdayOf,
  type PlanBlock,
  type PlanInput,
} from '@/domain';
import { commitment, planInput, SETTINGS, task } from '../../helpers/fixtures';

function minutesByTask(blocks: PlanBlock[], taskId: string) {
  return blocks.filter((b) => b.taskId === taskId).reduce((s, b) => s + blockMinutes(b), 0);
}

function minutesByDay(blocks: PlanBlock[]) {
  const map = new Map<string, number>();
  for (const b of blocks) map.set(b.date, (map.get(b.date) ?? 0) + blockMinutes(b));
  return map;
}

const aula = commitment({ id: 'aula', start: 19 * 60, end: 22 * 60 });
const estagio = commitment({ id: 'estagio', start: 8 * 60, end: 13 * 60 });

const busyWeek: PlanInput = planInput({
  commitments: [aula, estagio],
  tasks: [
    task({ id: 'tcc', durationMinutes: 600, deadline: '2026-12-11', priority: 'alta' }),
    task({ id: 'prova', durationMinutes: 300, deadline: '2026-11-25', priority: 'alta' }),
    task({ id: 'leitura', durationMinutes: 90, deadline: '2026-11-23', priority: 'baixa' }),
  ],
});

describe('generatePlan', () => {
  it('distribui toda a duração em blocos de 30 min a 2 h (RF04, RN07)', () => {
    const { blocks, alerts } = generatePlan(busyWeek);
    expect(alerts).toEqual([]);
    expect(minutesByTask(blocks, 'tcc')).toBe(600);
    expect(minutesByTask(blocks, 'prova')).toBe(300);
    expect(minutesByTask(blocks, 'leitura')).toBe(90);
    for (const b of blocks) {
      expect(blockMinutes(b)).toBeGreaterThanOrEqual(RULES.BLOCK_MIN_MINUTES);
      expect(blockMinutes(b)).toBeLessThanOrEqual(RULES.BLOCK_MAX_MINUTES);
      expect(b.start % 30).toBe(0);
    }
  });

  it('é determinístico: mesma entrada gera o mesmo plano em 100 execuções (RNF06)', () => {
    const first = JSON.stringify(generatePlan(busyWeek));
    for (let i = 0; i < 100; i++) {
      expect(JSON.stringify(generatePlan(structuredClone(busyWeek)))).toBe(first);
    }
  });

  it('não sobrepõe compromissos fixos nem outros blocos (RN03)', () => {
    const { blocks } = generatePlan(busyWeek);
    for (const b of blocks) {
      const weekday = weekdayOf(b.date);
      for (const c of [aula, estagio]) {
        if (c.weekdays.includes(weekday)) expect(overlaps(b, c)).toBe(false);
      }
      for (const other of blocks) {
        if (other !== b && other.date === b.date) expect(overlaps(b, other)).toBe(false);
      }
    }
  });

  it('nenhum dia passa do limite diário (RN04)', () => {
    for (const minutes of minutesByDay(generatePlan(busyWeek).blocks).values()) {
      expect(minutes).toBeLessThanOrEqual(SETTINGS.dailyLimitMinutes);
    }
  });

  it('respeita a janela de horário e não planeja no passado (RF12, P11)', () => {
    const input = planInput({ now: '2026-11-20T15:10', tasks: [task({ id: 't', durationMinutes: 600 })] });
    for (const b of generatePlan(input).blocks) {
      expect(b.start).toBeGreaterThanOrEqual(SETTINGS.windowStart);
      expect(b.end).toBeLessThanOrEqual(SETTINGS.windowEnd);
      if (b.date === '2026-11-20') expect(b.start).toBeGreaterThanOrEqual(15 * 60 + 30);
      expect(b.date >= '2026-11-20').toBe(true);
    }
  });

  it('espalha uma tarefa longa ao longo das semanas em vez de concentrar no início', () => {
    const input = planInput({ tasks: [task({ id: 'tcc', durationMinutes: 600, deadline: '2026-12-10' })] });
    const days = [...new Set(generatePlan(input).blocks.map((b) => b.date))].sort();
    expect(days.length).toBeGreaterThanOrEqual(5);
    expect(days.at(-1)! > '2026-12-01').toBe(true);
    expect(days.at(-1)! <= '2026-12-10').toBe(true);
  });

  it('prazo mais próximo vem primeiro (RN06)', () => {
    const input = planInput({
      tasks: [
        task({ id: 'tcc', deadline: '2026-12-10', priority: 'alta' }),
        task({ id: 'relatorio', deadline: '2026-11-21', priority: 'baixa' }),
      ],
    });
    expect(generatePlan(input).blocks[0]?.taskId).toBe('relatorio');
  });

  it('com o mesmo prazo, maior prioridade vem primeiro (RN06)', () => {
    const input = planInput({
      tasks: [
        task({ id: 'b-baixa', deadline: '2026-11-20', priority: 'baixa', durationMinutes: 60 }),
        task({ id: 'a-alta', deadline: '2026-11-20', priority: 'alta', durationMinutes: 60 }),
      ],
    });
    expect(generatePlan(input).blocks[0]?.taskId).toBe('a-alta');
  });

  it('desempata por menor duração e depois pela criação (RN06)', () => {
    const base = { deadline: '2026-11-20', priority: 'media' as const };
    const input = planInput({
      tasks: [
        task({ id: 'longa', ...base, durationMinutes: 120 }),
        task({ id: 'curta', ...base, durationMinutes: 60 }),
        task({ id: 'antiga', ...base, durationMinutes: 60, createdAt: '2026-10-01T10:00' }),
      ],
    });
    expect(generatePlan(input).blocks.map((b) => b.taskId)).toEqual(['antiga', 'curta', 'longa']);
  });

  it('avisa quando a tarefa não cabe até o prazo (RF10)', () => {
    // Hoje 8h–22h, limite de 3 h: só cabem 3 h até o fim do dia.
    const input = planInput({ tasks: [task({ id: 'tcc', durationMinutes: 600, deadline: '2026-11-20' })] });
    const { blocks, alerts } = generatePlan(input);
    expect(minutesByTask(blocks, 'tcc')).toBe(180);
    expect(alerts).toEqual([{ taskId: 'tcc', missingMinutes: 420 }]);
  });

  it('tarefa com prazo vencido gera alerta e nenhum bloco', () => {
    const input = planInput({ tasks: [task({ id: 'atrasada', deadline: '2026-11-19' })] });
    expect(generatePlan(input)).toEqual({
      blocks: [],
      alerts: [{ taskId: 'atrasada', missingMinutes: 120 }],
    });
  });

  it('mantém blocos fixados e concluídos e desconta da duração (RN05)', () => {
    const pinned: PlanBlock = {
      id: 'fixo',
      taskId: 'tcc',
      date: '2026-11-24',
      start: 14 * 60,
      end: 16 * 60,
      pinned: true,
      done: false,
    };
    const done: PlanBlock = { ...pinned, id: 'feito', date: '2026-11-20', start: 600, end: 660, pinned: false, done: true };
    const loose: PlanBlock = { ...pinned, id: 'solto', date: '2026-11-21', pinned: false };
    const input = planInput({
      tasks: [task({ id: 'tcc', durationMinutes: 300 })],
      existingBlocks: [pinned, done, loose],
    });
    const { blocks } = generatePlan(input);
    expect(blocks).toContainEqual(pinned);
    expect(blocks).toContainEqual(done);
    expect(blocks.find((b) => b.id === 'solto')).toBeUndefined();
    expect(minutesByTask(blocks, 'tcc')).toBe(300);
  });

  it('descarta blocos de tarefas excluídas', () => {
    const orphan: PlanBlock = { id: 'x', taskId: 'apagada', date: '2026-11-21', start: 600, end: 660, pinned: true, done: false };
    expect(generatePlan(planInput({ existingBlocks: [orphan] })).blocks).toEqual([]);
  });

  it('tarefa curta (20 min) vira um bloco de 30 min (P2)', () => {
    const { blocks } = generatePlan(planInput({ tasks: [task({ id: 'curta', durationMinutes: 20 })] }));
    expect(blocks).toHaveLength(1);
    expect(blockMinutes(blocks[0]!)).toBe(30);
  });

  it('não cria bloco menor que 1 h quando ainda falta mais que isso (RN07)', () => {
    // Só sobram buracos de 30 min no dia: 90 min de tarefa não cabem.
    const gaps = [0, 1, 2, 3, 4, 5, 6].map((i) =>
      commitment({ id: `c${i}`, weekdays: [5], start: 480 + i * 120 + 30, end: 480 + (i + 1) * 120 }),
    );
    const input = planInput({
      commitments: gaps,
      settings: { ...SETTINGS, windowEnd: 480 + 7 * 120 },
      tasks: [task({ id: 't', durationMinutes: 90, deadline: '2026-11-20' })],
    });
    const { blocks, alerts } = generatePlan(input);
    expect(blocks).toEqual([]);
    expect(alerts).toEqual([{ taskId: 't', missingMinutes: 90 }]);
  });
});
