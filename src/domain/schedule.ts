import { overlaps, snapToSlots, subtractIntervals, type Interval } from './intervals';
import { RULES } from './rules';
import { dateOf, formatDuration, formatMinute, isOnSlot, minuteOf, weekdayOf } from './time';
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
): Interval[] {
  return [
    ...commitmentsOn(date, commitments).map((c) => ({ start: c.start, end: c.end })),
    ...blocks
      .filter((b) => b.date === date && b.id !== ignoreBlockId)
      .map((b) => ({ start: b.start, end: b.end })),
  ];
}

/**
 * Trechos livres em `date`: janela do usuário (RF12) menos compromissos e blocos,
 * começando em `fromMinute` (para não planejar no passado, P11), na grade de 30 min.
 */
export function freeIntervals(
  date: IsoDate,
  settings: UserSettings,
  commitments: FixedCommitment[],
  blocks: PlanBlock[],
  fromMinute = 0,
): Interval[] {
  const base = { start: Math.max(settings.windowStart, fromMinute), end: settings.windowEnd };
  return subtractIntervals([base], busyIntervals(date, commitments, blocks))
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
  if (!isOnSlot(start) || !isOnSlot(end) || end <= start) {
    return 'Escolha um horário válido, em intervalos de 30 minutos.';
  }
  const today = dateOf(check.now);
  if (date < today || (date === today && start < minuteOf(check.now))) {
    return 'Não é possível mover para um horário que já passou.';
  }
  if (start < settings.windowStart || end > settings.windowEnd) {
    return `Fora da sua janela de horário (${formatMinute(settings.windowStart)} às ${formatMinute(settings.windowEnd)}).`;
  }
  const target = { start, end };
  const conflict = busyIntervals(date, check.commitments, check.blocks, check.blockId).some((i) =>
    overlaps(i, target),
  );
  if (conflict) return 'Esse horário conflita com um compromisso ou outro bloco.';
  const used = usedMinutes(date, check.blocks, check.blockId);
  if (used + (end - start) > settings.dailyLimitMinutes) {
    return `Esse dia passaria do limite diário de ${formatDuration(settings.dailyLimitMinutes)}.`;
  }
  return null;
}

export { RULES };
