import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, RULES } from '@/domain';

// Garante que as constantes das regras são coerentes entre si.
describe('RULES', () => {
  it('blocos mínimo e máximo são múltiplos do intervalo de 30 min (P7)', () => {
    expect(RULES.BLOCK_MIN_MINUTES % RULES.SLOT_MINUTES).toBe(0);
    expect(RULES.BLOCK_MAX_MINUTES % RULES.SLOT_MINUTES).toBe(0);
    expect(RULES.BLOCK_MIN_MINUTES).toBeLessThan(RULES.BLOCK_MAX_MINUTES);
  });

  it('configuração padrão respeita RN09 e tem janela válida', () => {
    expect(DEFAULT_SETTINGS.dailyLimitMinutes).toBeGreaterThanOrEqual(RULES.DAILY_LIMIT_MIN_MINUTES);
    expect(DEFAULT_SETTINGS.dailyLimitMinutes).toBeLessThanOrEqual(RULES.DAILY_LIMIT_MAX_MINUTES);
    expect(DEFAULT_SETTINGS.windowStart).toBeLessThan(DEFAULT_SETTINGS.windowEnd);
  });
});
