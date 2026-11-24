import { describe, expect, it } from 'vitest';
import { taskProgress, type PlanBlock } from '@/domain';
import { task } from '../../helpers/fixtures';

describe('taskProgress', () => {
  it('soma planejado, concluído e o que falta', () => {
    const t = task({ id: 't', durationMinutes: 200 });
    const blocks: PlanBlock[] = [
      { id: 'a', taskId: 't', date: '2026-11-20', start: 480, end: 600, pinned: false, done: true },
      { id: 'b', taskId: 't', date: '2026-11-21', start: 480, end: 540, pinned: false, done: false },
      { id: 'c', taskId: 'outra', date: '2026-11-21', start: 600, end: 660, pinned: false, done: false },
    ];
    expect(taskProgress(t, blocks, [{ taskId: 't', missingMinutes: 30 }])).toEqual({
      taskId: 't',
      totalMinutes: 210,
      plannedMinutes: 180,
      doneMinutes: 120,
      missingMinutes: 30,
    });
  });
});
