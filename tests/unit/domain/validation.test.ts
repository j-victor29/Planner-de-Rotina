import { describe, expect, it } from 'vitest';
import {
  hasErrors,
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

const validSettings: UserSettings = { dailyLimitMinutes: 180, windowStart: 420, windowEnd: 1380 };

describe('validateSettings (RN09, RF12)', () => {
  it.each([
    [30, true],
    [60, false],
    [960, false],
    [990, true],
  ])('limite diário %i min → inválido? %s (BVA)', (dailyLimitMinutes, invalid) => {
    const errors = validateSettings({ ...validSettings, dailyLimitMinutes });
    expect(errors.dailyLimitMinutes !== undefined).toBe(invalid);
  });

  it('janela: fim antes do início, menor que 1 h, e válida', () => {
    expect(validateSettings({ ...validSettings, windowEnd: 390 }).windowEnd).toBe(
      'O fim deve ser depois do início.',
    );
    expect(validateSettings({ ...validSettings, windowEnd: 450 }).windowEnd).toBe(
      'A janela precisa ter pelo menos 1 hora.',
    );
    expect(validateSettings({ ...validSettings, windowEnd: 480 }).windowEnd).toBeUndefined();
  });

  it('rejeita horários fora da grade', () => {
    const errors = validateSettings({ ...validSettings, windowStart: 10, windowEnd: 9999 });
    expect(errors.windowStart).toBeDefined();
    expect(errors.windowEnd).toBeDefined();
  });
});
