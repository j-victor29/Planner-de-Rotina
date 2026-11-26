import { describe, expect, it } from 'vitest';
import {
  hasErrors,
  sleepWarning,
  validateCommitment,
  validateSettings,
  validateTask,
  type FixedCommitmentInput,
  type TaskInput,
  type UserSettings,
} from '@/domain';
import { TODAY } from '../../helpers/fixtures';

const validTask: TaskInput = {
  title: 'TCC',
  durationMinutes: 600,
  deadline: '2026-12-11',
  priority: 'alta',
};

describe('validateTask (RN01, RN02)', () => {
  it('aceita uma tarefa válida', () => {
    expect(hasErrors(validateTask(validTask, TODAY))).toBe(false);
  });

  it.each([
    [0, 'A duração deve ser maior que zero.'],
    [-30, 'A duração deve ser maior que zero.'],
    [200 * 60 + 30, 'A duração máxima é de 200h.'],
  ])('rejeita duração %i (BVA)', (durationMinutes, message) => {
    expect(validateTask({ ...validTask, durationMinutes }, TODAY).durationMinutes).toBe(message);
  });

  it.each([30, 200 * 60])('aceita duração-limite %i', (durationMinutes) => {
    expect(validateTask({ ...validTask, durationMinutes }, TODAY).durationMinutes).toBeUndefined();
  });

  it('prazo: ontem é rejeitado, hoje e amanhã são aceitos (BVA)', () => {
    expect(validateTask({ ...validTask, deadline: '2026-11-19' }, TODAY).deadline).toBe(
      'O prazo não pode ser anterior a hoje.',
    );
    expect(validateTask({ ...validTask, deadline: TODAY }, TODAY).deadline).toBeUndefined();
    expect(validateTask({ ...validTask, deadline: '2026-11-21' }, TODAY).deadline).toBeUndefined();
  });

  it('rejeita título vazio, título longo, prazo inválido e prioridade desconhecida', () => {
    const errors = validateTask(
      { title: '   ', durationMinutes: 60, deadline: '2026-02-30', priority: 'urgente' as never },
      TODAY,
    );
    expect(errors.title).toBe('Informe o título da tarefa.');
    expect(errors.deadline).toBe('Informe um prazo válido.');
    expect(errors.priority).toBe('Escolha a prioridade.');
    expect(validateTask({ ...validTask, title: 'x'.repeat(81) }, TODAY).title).toBe(
      'Use no máximo 80 caracteres.',
    );
  });
});

const validCommitment: FixedCommitmentInput = {
  title: 'Aula',
  weekdays: [1, 2, 3, 4, 5],
  start: 19 * 60,
  end: 22 * 60,
};

describe('validateCommitment (RN10)', () => {
  it('aceita um compromisso válido', () => {
    expect(hasErrors(validateCommitment(validCommitment))).toBe(false);
  });

  it('fim igual ao início é rejeitado; início + 30 min é aceito (BVA)', () => {
    expect(validateCommitment({ ...validCommitment, end: validCommitment.start }).end).toBe(
      'O horário de fim deve ser depois do início.',
    );
    expect(
      validateCommitment({ ...validCommitment, end: validCommitment.start + 30 }).end,
    ).toBeUndefined();
  });

  it('exige nome, dias e horários na grade de 30 min', () => {
    const errors = validateCommitment({ title: '', weekdays: [], start: 15, end: 2000 });
    expect(errors.title).toBe('Informe o nome do compromisso.');
    expect(errors.weekdays).toBe('Escolha pelo menos um dia da semana.');
    expect(errors.start).toBe('Escolha um horário de início válido.');
    expect(errors.end).toBe('Escolha um horário de fim válido.');
  });
});

const validSettings: UserSettings = {
  dailyLimitMinutes: 180,
  weekendLimitMinutes: null,
  sleepStart: 23 * 60,
  sleepEnd: 7 * 60,
  preferredPeriod: 'qualquer',
  restDays: [0],
  breakMinutes: 0,
};

describe('validateSettings (RN09, RF12)', () => {
  it('aceita configurações válidas', () => {
    expect(hasErrors(validateSettings(validSettings))).toBe(false);
  });

  it.each([
    [30, true],
    [60, false],
    [960, false],
    [990, true],
  ])('limite diário %i min → inválido? %s (BVA)', (dailyLimitMinutes, invalid) => {
    const errors = validateSettings({ ...validSettings, dailyLimitMinutes });
    expect(errors.dailyLimitMinutes !== undefined).toBe(invalid);
  });

  it('limite do fim de semana segue a mesma faixa', () => {
    expect(validateSettings({ ...validSettings, weekendLimitMinutes: 30 }).weekendLimitMinutes).toBeDefined();
    expect(validateSettings({ ...validSettings, weekendLimitMinutes: 300 }).weekendLimitMinutes).toBeUndefined();
  });

  it('dormir e acordar no mesmo horário é rejeitado', () => {
    expect(validateSettings({ ...validSettings, sleepEnd: 23 * 60 }).sleepEnd).toBe(
      'Os horários de dormir e acordar não podem ser iguais.',
    );
  });

  it('precisa ficar acordado pelo menos 1 hora', () => {
    expect(validateSettings({ ...validSettings, sleepStart: 8 * 60, sleepEnd: 7 * 60 + 30 }).sleepEnd).toBe(
      'Você precisa ficar acordado pelo menos 1 hora por dia.',
    );
  });

  it('rejeita horários fora da grade, 7 dias de descanso, período e pausa inválidos', () => {
    const errors = validateSettings({
      ...validSettings,
      sleepStart: 10,
      sleepEnd: 9999,
      restDays: [0, 1, 2, 3, 4, 5, 6],
      preferredPeriod: 'madrugada' as never,
      breakMinutes: 15,
    });
    expect(Object.keys(errors).sort()).toEqual(['breakMinutes', 'preferredPeriod', 'restDays', 'sleepEnd', 'sleepStart']);
  });
});

describe('sleepWarning', () => {
  it('avisa com menos de 8 h de sono e não avisa com 8 h (BVA)', () => {
    expect(sleepWarning({ sleepStart: 23 * 60 + 30, sleepEnd: 7 * 60 })).toMatch(/7h30 de sono/);
    expect(sleepWarning({ sleepStart: 23 * 60, sleepEnd: 7 * 60 })).toBeNull();
  });
});
