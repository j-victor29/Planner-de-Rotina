import { describe, expect, it } from 'vitest';
import { generatePlan, type Task } from '@/domain';
import { commitment, planInput } from '../helpers/fixtures';

// RNF01 — gerar o plano com 50 tarefas em menos de 2 segundos.
describe('desempenho do planejamento (RNF01)', () => {
  it('50 tarefas e 4 semanas em menos de 2 s', () => {
    const tasks: Task[] = Array.from({ length: 50 }, (_, i) => ({
      id: `t${String(i).padStart(2, '0')}`,
      title: `Tarefa ${i}`,
      durationMinutes: 60 + (i % 6) * 60,
      deadline: `2026-12-${String(1 + (i % 28)).padStart(2, '0')}`,
      priority: (['alta', 'media', 'baixa'] as const)[i % 3]!,
      createdAt: '2026-11-01T10:00',
    }));
    const input = planInput({
      commitments: [
        commitment({ id: 'estagio', start: 480, end: 780 }),
        commitment({ id: 'aula', start: 1140, end: 1320 }),
      ],
      settings: { dailyLimitMinutes: 480, windowStart: 420, windowEnd: 1380 },
      tasks,
    });

    const started = performance.now();
    const result = generatePlan(input);
    const elapsed = performance.now() - started;

    expect(result.blocks.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(2000);
  });
});
