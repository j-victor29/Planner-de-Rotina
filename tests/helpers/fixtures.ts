import type { FixedCommitment, PlanInput, Task, UserSettings } from '@/domain';

/** Dados de apoio para os testes. Quinta-feira, 20/11/2026, 08:00. */
export const NOW = '2026-11-20T08:00';
export const TODAY = '2026-11-20';

export const SETTINGS: UserSettings = {
  dailyLimitMinutes: 3 * 60,
  windowStart: 8 * 60,
  windowEnd: 22 * 60,
};

export function task(overrides: Partial<Task> & Pick<Task, 'id'>): Task {
  return {
    title: overrides.id,
    durationMinutes: 120,
    deadline: '2026-11-30',
    priority: 'media',
    createdAt: '2026-11-01T10:00',
    ...overrides,
  };
}

export function commitment(overrides: Partial<FixedCommitment> & Pick<FixedCommitment, 'id'>): FixedCommitment {
  return {
    title: overrides.id,
    weekdays: [1, 2, 3, 4, 5],
    start: 9 * 60,
    end: 12 * 60,
    ...overrides,
  };
}

export function planInput(overrides: Partial<PlanInput> = {}): PlanInput {
  return {
    now: NOW,
    commitments: [],
    tasks: [],
    existingBlocks: [],
    settings: SETTINGS,
    ...overrides,
  };
}
