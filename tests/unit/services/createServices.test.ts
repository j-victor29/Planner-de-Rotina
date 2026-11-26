import { describe, expect, it } from 'vitest';
import { createServices } from '@/services';

describe('createServices', () => {
  it('cria os serviços em memória no modo mock', () => {
    const services = createServices('mock');
    expect(services.auth.getCurrentUser()).toBeNull();
    expect(typeof services.tasks.list).toBe('function');
  });

  it('modo firebase sem configuração avisa o que falta', () => {
    expect(() => createServices('firebase', { config: {} })).toThrow(/VITE_FIREBASE_/);
  });

  it('modo firebase configurado cria os serviços', () => {
    const services = createServices('firebase', {
      config: { apiKey: 'demo-key', projectId: 'demo-planner', appId: 'demo-app', authDomain: 'demo-planner.firebaseapp.com' },
      appName: 'teste-create-services',
    });
    expect(services.auth.getCurrentUser()).toBeNull();
    expect(typeof services.profile.get).toBe('function');
  });
});
