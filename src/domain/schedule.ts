import { overlaps, snapToSlots, subtractIntervals, type Interval } from './intervals';
import { RULES } from './rules';
import {
  dateOf,
  formatDuration,
  formatMinute,
  isOnSlot,
  MINUTES_PER_DAY,
  minuteOf,
  weekdayOf,
} from './time';
import type {
  FixedCommitment,
  Id,
  IsoDate,
  IsoDateTime,
  PlanBlock,
  UserSettings,
} from './types';

/** Duração de um bloco em minutos. */
export function blockMinutes(block: Pick<PlanBlock, 'start' | 'end'>): number {
  return block.end - block.start;
}

const normalize = (minute: number) => ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

/** Minutos de sono por noite (ex.: 23:00 → 07:00 = 480). */
export function sleepMinutes(settings: Pick<UserSettings, 'sleepStart' | 'sleepEnd'>): number {
  return normalize(settings.sleepEnd - settings.sleepStart);
}

/** Trechos do dia em que o usuário está dormindo (o sono pode atravessar a meia-noite). */
export function sleepIntervals(settings: Pick<UserSettings, 'sleepStart' | 'sleepEnd'>): Interval[] {
  const start = normalize(settings.sleepStart);
  const end = normalize(settings.sleepEnd);
  if (start === end) return [];
  if (start < end) return [{ start, end }];
  return [
    { start: 0, end },
    { start, end: MINUTES_PER_DAY },
  ].filter((i) => i.end > i.start);
}

/** Trechos do dia em que o usuário está acordado (RF12). */
export function awakeIntervals(settings: Pick<UserSettings, 'sleepStart' | 'sleepEnd'>): Interval[] {
  return subtractIntervals([{ start: 0, end: MINUTES_PER_DAY }], sleepIntervals(settings));
}

/** Dia de descanso: nenhum bloco de tarefa é colocado nele. */
export function isRestDay(date: IsoDate, settings: Pick<UserSettings, 'restDays'>): boolean {
  return settings.restDays.includes(weekdayOf(date));
}

/** RN04 — limite do dia (o fim de semana pode ter limite próprio). */
export function dailyLimitFor(date: IsoDate, settings: UserSettings): number {
  const weekday = weekdayOf(date);
  const weekend = weekday === 0 || weekday === 6;
  return weekend && settings.weekendLimitMinutes !== null
    ? settings.weekendLimitMinutes
    : settings.dailyLimitMinutes;
}

/** Compromissos fixos que acontecem em `date`. */
export function commitmentsOn(date: IsoDate, commitments: FixedCommitment[]): FixedCommitment[] {
  const weekday = weekdayOf(date);
  return commitments.filter((c) => c.weekdays.includes(weekday));
}

/** Trechos ocupados em `date` por compromissos e blocos (RN03). */
export function busyIntervals(
  date: IsoDate,
  commitments: FixedCommitment[],
  blocks: PlanBlock[],
  ignoreBlockId?: Id,
  blockPadding = 0,
): Interval[] {
  return [
    ...commitmentsOn(date, commitments).map((c) => ({ start: c.start, end: c.end })),
    ...blocks
      .filter((b) => b.date === date && b.id !== ignoreBlockId)
      .map((b) => ({ start: b.start - blockPadding, end: b.end + blockPadding })),
  ];
}

/**
 * Trechos livres em `date`: tempo acordado menos compromissos e blocos,
 * a partir de `fromMinute` (P11), na grade de 30 min. Dia de descanso não tem
 * tempo livre. `blockPadding` reserva a pausa entre blocos.
 */
export function freeIntervals(
  date: IsoDate,
  settings: UserSettings,
  commitments: FixedCommitment[],
  blocks: PlanBlock[],
  fromMinute = 0,
  blockPadding = 0,
): Interval[] {
  if (isRestDay(date, settings)) return [];
  const base = subtractIntervals(awakeIntervals(settings), [{ start: 0, end: fromMinute }]);
  return subtractIntervals(base, busyIntervals(date, commitments, blocks, undefined, blockPadding))
    .map(snapToSlots)
    .filter((i): i is Interval => i !== null);
}

/** Minutos de blocos (planejados ou concluídos) em `date` (RN04). */
export function usedMinutes(date: IsoDate, blocks: PlanBlock[], ignoreBlockId?: Id): number {
  return blocks
    .filter((b) => b.date === date && b.id !== ignoreBlockId)
    .reduce((sum, b) => sum + blockMinutes(b), 0);
}

export interface PlacementCheck {
  blockId: Id;
  date: IsoDate;
  start: number;
  end: number;
  now: IsoDateTime;
  commitments: FixedCommitment[];
  blocks: PlanBlock[];
  settings: UserSettings;
}

/**
 * RF06 — verifica se um bloco pode ser colocado no horário pedido.
 * Retorna a mensagem de erro para o usuário, ou null se for possível.
 */
export function checkBlockPlacement(check: PlacementCheck): string | null {
  const { date, start, end, settings } = check;
  if (!isOnSlot(start) || !isOnSlot(end) || end <= start || end > MINUTES_PER_DAY) {
    return 'Escolha um horário válido, em intervalos de 30 minutos.';
  }
  const today = dateOf(check.now);
  if (date < today || (date === today && start < minuteOf(check.now))) {
    return 'Não é possível mover para um horário que já passou.';
  }
  if (isRestDay(date, settings)) {
    return 'Esse é o seu dia de descanso. Escolha outro dia.';
  }
  const awake = awakeIntervals(settings).some((i) => start >= i.start && end <= i.end);
  if (!awake) {
    return `Esse horário é durante o seu sono (${formatMinute(normalize(settings.sleepStart))} às ${formatMinute(normalize(settings.sleepEnd))}).`;
  }
  const target = { start, end };
  const conflict = busyIntervals(date, check.commitments, check.blocks, check.blockId).some((i) =>
    overlaps(i, target),
  );
  if (conflict) return 'Esse horário conflita com um compromisso ou outro bloco.';
  const limit = dailyLimitFor(date, settings);
  if (usedMinutes(date, check.blocks, check.blockId) + (end - start) > limit) {
    return `Esse dia passaria do limite diário de ${formatDuration(limit)}.`;
  }
  return null;
}

export { RULES };
