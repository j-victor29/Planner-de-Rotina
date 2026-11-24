import { describe, expect, it } from 'vitest';
import { createServices } from '@/services';

describe('createServices', () => {
  it('cria os serviços em memória no modo mock', () => {
    const services = createServices('mock');
    expect(services.auth.getCurrentUser()).toBeNull();
    expect(typeof services.tasks.list).toBe('function');
  });

  it('o modo firebase ainda não está disponível (etapa 3)', () => {
    expect(() => createServices('firebase')).toThrow(/etapa 3/);
  });
});
