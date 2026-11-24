import { describe, expect, it } from 'vitest';
import { recalculatePlan } from '@/services/planningService';
import type { AppServices } from '@/services/AppServices';

describe('recalculatePlan', () => {
  it('lança erro informando que o recálculo será implementado na etapa 2', async () => {
    await expect(recalculatePlan({} as AppServices, '2026-11-24T12:00:00Z')).rejects.toThrow(
      'recalculatePlan: não implementado (etapa 2)',
    );
  });
});
