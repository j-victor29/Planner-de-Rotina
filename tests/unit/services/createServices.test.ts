import { describe, expect, it } from 'vitest';
import { createServices } from '@/services/createServices';

describe('createServices', () => {
  it('chama createMockServices quando source for mock', () => {
    expect(() => createServices('mock')).toThrow(
      'createMockServices: não implementado (etapa 2)',
    );
  });

  it('chama createFirebaseServices quando source for firebase', () => {
    expect(() => createServices('firebase')).toThrow(
      'createFirebaseServices: não implementado (etapa 3)',
    );
  });
});
