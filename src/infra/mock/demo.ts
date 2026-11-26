import {
  addDays,
  defaultSettings,
  fromJsDate,
  dateOf,
  type FixedCommitment,
  type IsoDate,
  type Task,
} from '@/domain';
import type { AppServices } from '@/services/AppServices';
import { createMockServices } from './createMockServices';
import { memoryStore, type MockDatabase, type MockUserData } from './store';

export const DEMO_USER = { id: 'demo', name: 'Visitante', email: 'demo@planner.local', provider: 'password' as const };

/** Semana de exemplo: estudante com estágio de manhã e aula à noite. */
export function buildDemoData(today: IsoDate): MockUserData {
  const weekdays = [1, 2, 3, 4, 5] as FixedCommitment['weekdays'];
  const commitments: FixedCommitment[] = [
    { id: 'demo-estagio', title: 'Estágio', weekdays, start: 8 * 60, end: 13 * 60 },
    { id: 'demo-aula', title: 'Aula', weekdays, start: 19 * 60, end: 22 * 60 + 30 },
    { id: 'demo-ingles', title: 'Inglês', weekdays: [6], start: 9 * 60, end: 11 * 60 },
  ];
  const createdAt = `${today}T08:00`;
  const tasks: Task[] = [
    { id: 'demo-tcc', title: 'TCC — revisão bibliográfica', durationMinutes: 10 * 60, deadline: addDays(today, 18), priority: 'alta', createdAt },
    { id: 'demo-prova', title: 'Estudar para prova de Cálculo', durationMinutes: 5 * 60, deadline: addDays(today, 5), priority: 'alta', createdAt },
    { id: 'demo-relatorio', title: 'Relatório de Física', durationMinutes: 3 * 60, deadline: addDays(today, 8), priority: 'media', createdAt },
    { id: 'demo-leitura', title: 'Leitura de Sociologia', durationMinutes: 90, deadline: addDays(today, 3), priority: 'baixa', createdAt },
  ];
  return {
    onboardingCompleted: true,
    commitments,
    tasks,
    blocks: [],
    settings: { ...defaultSettings(), dailyLimitMinutes: 3 * 60, preferredPeriod: 'tarde', restDays: [0] },
  };
}

/** Serviços do modo demonstração: dados de exemplo, só em memória. */
export function createDemoServices(now: Date = new Date()): AppServices {
  const today = dateOf(fromJsDate(now));
  const db: MockDatabase = {
    accounts: { [DEMO_USER.email]: { ...DEMO_USER, passwordHash: '' } },
    sessionUserId: DEMO_USER.id,
    data: { [DEMO_USER.id]: buildDemoData(today) },
  };
  return createMockServices({ store: memoryStore(db), clock: () => now });
}
