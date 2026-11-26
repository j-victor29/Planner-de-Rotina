import { RULES } from './rules';

/** Resultado da leitura de um texto digitado pelo usuário. */
export type ParseResult = { ok: true; minutes: number } | { ok: false; error: string };

const fail = (error: string): ParseResult => ({ ok: false, error });

export const CLOCK_MESSAGES = {
  empty: 'Informe o horário.',
  invalid: 'Digite um horário válido (ex.: 19:30).',
  slot: 'Use horários de meia em meia hora (ex.: 19:00 ou 19:30).',
} as const;

export const DURATION_MESSAGES = {
  empty: 'Informe a duração.',
  invalid: 'Digite a duração em horas (ex.: 2, 2:30 ou 2h30).',
  zero: 'A duração deve ser maior que zero.',
  slot: 'Use durações de meia em meia hora (ex.: 2h ou 2h30).',
} as const;

/**
 * Lê um horário digitado: "19:30", "1930", "19h30", "19h", "7", "730".
 * Só aceita minutos :00 ou :30 (P7).
 */
export function parseClock(text: string): ParseResult {
  const value = text.trim().toLowerCase().replace(/\s/g, '');
  if (!value) return fail(CLOCK_MESSAGES.empty);

  let hours: number;
  let minutes: number;
  const separated = /^(\d{1,2})[:h](\d{2})?$/.exec(value);
  if (separated) {
    hours = Number(separated[1]);
    minutes = separated[2] ? Number(separated[2]) : 0;
  } else if (/^\d{1,4}$/.test(value)) {
    hours = value.length <= 2 ? Number(value) : Number(value.slice(0, -2));
    minutes = value.length <= 2 ? 0 : Number(value.slice(-2));
  } else {
    return fail(CLOCK_MESSAGES.invalid);
  }

  if (hours > 24 || minutes > 59 || (hours === 24 && minutes > 0)) return fail(CLOCK_MESSAGES.invalid);
  if (minutes % RULES.SLOT_MINUTES !== 0) return fail(CLOCK_MESSAGES.slot);
  return { ok: true, minutes: hours * 60 + minutes };
}

/**
 * Lê uma duração digitada: "10", "10h", "10:30", "10h30", "10,5", "30min".
 * Só aceita múltiplos de 30 minutos.
 */
export function parseDuration(text: string): ParseResult {
  const value = text.trim().toLowerCase().replace(/\s/g, '').replace(',', '.');
  if (!value) return fail(DURATION_MESSAGES.empty);

  let minutes: number;
  let match: RegExpExecArray | null;
  if ((match = /^(\d{1,3})(?:\.(\d{1,2}))?h?$/.exec(value))) {
    minutes = Math.round(Number(`${match[1]}.${match[2] ?? '0'}`) * 60);
  } else if ((match = /^(\d{1,3})[:h](\d{1,2})(?:min|m)?$/.exec(value))) {
    if (Number(match[2]) > 59) return fail(DURATION_MESSAGES.invalid);
    minutes = Number(match[1]) * 60 + Number(match[2]);
  } else if ((match = /^(\d{1,5})(?:min|m)$/.exec(value))) {
    minutes = Number(match[1]);
  } else {
    return fail(DURATION_MESSAGES.invalid);
  }

  if (minutes <= 0) return fail(DURATION_MESSAGES.zero);
  if (minutes % RULES.SLOT_MINUTES !== 0) return fail(DURATION_MESSAGES.slot);
  return { ok: true, minutes };
}

/** Máscara para o campo de horário: "1930" → "19:30", "730" → "7:30". */
export function maskClock(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, -2)}:${digits.slice(-2)}`;
}
