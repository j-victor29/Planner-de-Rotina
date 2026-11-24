import { describe, expect, it } from 'vitest';
import { generatePlan } from '@/domain/planner/generatePlan';
import type { PlanInput } from '@/domain/types';

describe('generatePlan', () => {
  it('lança erro informando que o algoritmo será implementado na etapa 2', () => {
    expect(() => generatePlan({} as PlanInput)).toThrow(
      'generatePlan: não implementado (etapa 2)',
    );
  });
});
