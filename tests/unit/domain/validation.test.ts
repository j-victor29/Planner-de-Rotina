import { describe, expect, it } from 'vitest';
import { validateCommitment, validateSettings, validateTask } from '@/domain/validation';
import type { FixedCommitmentInput, TaskInput, UserSettings } from '@/domain/types';

describe('validation', () => {
  it('lança erro para validateTask na etapa atual', () => {
    expect(() => validateTask({} as TaskInput, '2026-11-24')).toThrow(
      'validateTask: não implementado (etapa 2)',
    );
  });

  it('lança erro para validateCommitment na etapa atual', () => {
    expect(() => validateCommitment({} as FixedCommitmentInput)).toThrow(
      'validateCommitment: não implementado (etapa 2)',
    );
  });

  it('lança erro para validateSettings na etapa atual', () => {
    expect(() => validateSettings({} as UserSettings)).toThrow(
      'validateSettings: não implementado (etapa 2)',
    );
  });
});
