import { describe, expect, it, vi } from 'vitest';
import { buildDemoData, createDemoServices, createMockServices, memoryStore } from '@/infra/mock';

function setup() {
  return createMockServices({ store: memoryStore(), clock: () => new Date(2026, 10, 20, 8) });
}

describe('autenticação mock (RF01)', () => {
  it('cadastro entra na conta e avisa os ouvintes', async () => {
    const services = setup();
    const listener = vi.fn();
    services.auth.onAuthChange(listener);
    const user = await services.auth.signUp({ name: 'Ana', email: 'Ana@Teste.com', password: 'Senha123' });
    expect(user.email).toBe('ana@teste.com');
    expect(listener).toHaveBeenLastCalledWith(user);
  });

  it('login com senha errada exibe erro (US01)', async () => {
    const services = setup();
    await services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });
    await services.auth.signOut();
    await expect(services.auth.signIn('ana@teste.com', 'errada')).rejects.toThrow('E-mail ou senha inválidos.');
    await expect(services.auth.signIn('ana@teste.com', 'Senha123')).resolves.toMatchObject({ name: 'Ana' });
  });

  it('não permite e-mail duplicado', async () => {
    const services = setup();
    await services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });
    await expect(
      services.auth.signUp({ name: 'Outra', email: 'ana@teste.com', password: 'Senha123' }),
    ).rejects.toThrow('Já existe uma conta com este e-mail.');
  });

  it('um usuário não vê dados de outro (RNF05)', async () => {
    const services = setup();
    await services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });
    await services.tasks.create({ title: 'TCC', durationMinutes: 60, deadline: '2026-11-30', priority: 'alta' });
    await services.auth.signOut();
    await services.auth.signUp({ name: 'Carlos', email: 'carlos@teste.com', password: 'Senha123' });
    expect(await services.tasks.list()).toEqual([]);
  });

  it('sem login, os repositórios recusam acesso', async () => {
    await expect(setup().tasks.list()).rejects.toThrow('Usuário não autenticado.');
  });

  it('excluir conta apaga os dados (RF13)', async () => {
    const services = setup();
    await services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });
    await services.auth.deleteAccount();
    expect(services.auth.getCurrentUser()).toBeNull();
    await expect(services.auth.signIn('ana@teste.com', 'Senha123')).rejects.toThrow();
  });
});

describe('demonstração', () => {
  it('traz rotina e tarefas de exemplo relativas a hoje', async () => {
    const data = buildDemoData('2026-11-20');
    expect(data.tasks.every((t) => t.deadline > '2026-11-20')).toBe(true);
    const demo = createDemoServices(new Date(2026, 10, 20, 8));
    expect(await demo.tasks.list()).toHaveLength(data.tasks.length);
  });
});
