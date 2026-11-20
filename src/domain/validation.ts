import type { FixedCommitmentInput, IsoDate, TaskInput, UserSettings } from './types';

/** Resultado de validação: lista vazia = válido. Cada erro é uma mensagem para o usuário. */
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

/**
 * RN01, RN02 — valida os dados de uma tarefa.
 * Implementação: etapa 2.
 */
export function validateTask(_input: TaskInput, _today: IsoDate): ValidationErrors<TaskInput> {
  throw new Error('validateTask: não implementado (etapa 2)');
}

/**
 * RN10 — valida um compromisso fixo.
 * Implementação: etapa 2.
 */
export function validateCommitment(
  _input: FixedCommitmentInput,
): ValidationErrors<FixedCommitmentInput> {
  throw new Error('validateCommitment: não implementado (etapa 2)');
}

/**
 * RN09, RF12 — valida as configurações do usuário.
 * Implementação: etapa 2.
 */
export function validateSettings(_input: UserSettings): ValidationErrors<UserSettings> {
  throw new Error('validateSettings: não implementado (etapa 2)');
}
