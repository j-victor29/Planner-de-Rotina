import { getApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { beforeEach, describe, expect, it } from 'vitest';
import { createFirebaseServices } from '@/infra/firebase';
import { recalculatePlan, type AppServices } from '@/services';
import { NOW, SETTINGS } from '../helpers/fixtures';

/**
 * Integração com Firebase Auth + Firestore no emulador (projeto "demo-planner",
 * que só existe localmente). Rode com: npm run test:integration
 */
const PROJECT = 'demo-planner';
const APP_NAME = 'integracao';
const config = {
  apiKey: 'demo-key',
  authDomain: `${PROJECT}.firebaseapp.com`,
  projectId: PROJECT,
  appId: 'demo-app',
};

let services: AppServices;

async function resetEmulators() {
  await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' });
  await fetch(`http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, {
    method: 'DELETE',
  });
}

beforeEach(async () => {
  services = createFirebaseServices({ config, useEmulators: true, appName: APP_NAME });
  if (services.auth.getCurrentUser()) await services.auth.signOut();
  await resetEmulators();
});

const signUpAna = () => services.auth.signUp({ name: 'Ana', email: 'ana@teste.com', password: 'Senha123' });

describe('autenticação (RF01)', () => {
  it('cadastro cria a conta com o passo a passo pendente', async () => {
    const user = await signUpAna();
    expect(user).toMatchObject({ name: 'Ana', email: 'ana@teste.com', provider: 'password' });
    expect(await services.profile.get()).toEqual({ onboardingCompleted: false });
    await services.profile.completeOnboarding();
    expect(await services.profile.get()).toEqual({ onboardingCompleted: true });
  });

  it('login com senha errada mostra mensagem em português', async () => {
    await signUpAna();
    await services.auth.signOut();
    await expect(services.auth.signIn('ana@teste.com', 'errada123')).rejects.toThrow('E-mail ou senha inválidos.');
    await expect(services.auth.signIn('ana@teste.com', 'Senha123')).resolves.toMatchObject({ name: 'Ana' });
  });

  it('e-mail duplicado é recusado', async () => {
    await signUpAna();
    await services.auth.signOut();
    await expect(signUpAna()).rejects.toThrow('Já existe uma conta com este e-mail.');
  });
});

describe('dados no Firestore', () => {
  it('salva e lê rotina, tarefas, preferências e plano', async () => {
    await signUpAna();
    await services.settings.save(SETTINGS);
    const aula = await services.commitments.create({ title: 'Aula', weekdays: [1, 2], start: 1140, end: 1320 });
    const tcc = await services.tasks.create({ title: 'TCC', durationMinutes: 240, deadline: '2026-11-30', priority: 'alta' });

    expect(await services.settings.get()).toEqual(SETTINGS);
    expect(await services.commitments.list()).toEqual([aula]);
    expect(await services.tasks.list()).toEqual([tcc]);

    await services.tasks.update(tcc.id, { title: 'TCC final', durationMinutes: 300, deadline: '2026-11-30', priority: 'alta' });
    expect((await services.tasks.list())[0]).toMatchObject({ title: 'TCC final', createdAt: tcc.createdAt });

    const snapshot = await recalculatePlan(services, NOW);
    expect(snapshot.blocks.length).toBeGreaterThan(0);
    expect(await services.blocks.list()).toEqual(snapshot.blocks);

    await services.commitments.remove(aula.id);
    expect(await services.commitments.list()).toEqual([]);
  });

  it('usuário não acessa dados de outra conta (RNF05)', async () => {
    const ana = await signUpAna();
    const tarefa = await services.tasks.create({ title: 'Secreta', durationMinutes: 60, deadline: '2026-11-30', priority: 'baixa' });
    await services.auth.signOut();

    await services.auth.signUp({ name: 'Carlos', email: 'carlos@teste.com', password: 'Senha123' });
    expect(await services.tasks.list()).toEqual([]);

    const db = getFirestore(getApp(APP_NAME));
    await expect(getDoc(doc(db, 'users', ana.id, 'tasks', tarefa.id))).rejects.toMatchObject({ code: 'permission-denied' });
  });

  it('sem login, o banco recusa o acesso (RNF05)', async () => {
    const db = getFirestore(getApp(APP_NAME));
    await expect(getDoc(doc(db, 'users', 'qualquer'))).rejects.toMatchObject({ code: 'permission-denied' });
  });

  it('excluir conta apaga os dados e o login (RF13)', async () => {
    await signUpAna();
    await services.tasks.create({ title: 'TCC', durationMinutes: 60, deadline: '2026-11-30', priority: 'alta' });
    await expect(services.auth.deleteAccount({ password: 'errada123' })).rejects.toThrow('E-mail ou senha inválidos.');
    await services.auth.deleteAccount({ password: 'Senha123' });

    expect(services.auth.getCurrentUser()).toBeNull();
    await expect(services.auth.signIn('ana@teste.com', 'Senha123')).rejects.toThrow('E-mail ou senha inválidos.');

  });
});
