import { roundDownToSlot, roundUpToSlot } from './time';

/** Intervalo de minutos [start, end). */
export interface Interval {
  start: number;
  end: number;
}

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

export function totalLength(intervals: Interval[]): number {
  return intervals.reduce((sum, i) => sum + (i.end - i.start), 0);
}

/** Remove de `base` todos os trechos cobertos por `remove`. Resultado ordenado. */
export function subtractIntervals(base: Interval[], remove: Interval[]): Interval[] {
  let result = base.filter((i) => i.end > i.start).map((i) => ({ ...i }));
  for (const r of remove) {
    const next: Interval[] = [];
    for (const i of result) {
      if (!overlaps(i, r)) {
        next.push(i);
        continue;
      }
      if (r.start > i.start) next.push({ start: i.start, end: r.start });
      if (r.end < i.end) next.push({ start: r.end, end: i.end });
    }
    result = next;
  }
  return result.sort((a, b) => a.start - b.start);
}

/** Ajusta o intervalo à grade de 30 min (início para cima, fim para baixo). */
export function snapToSlots(interval: Interval): Interval | null {
  const start = roundUpToSlot(interval.start);
  const end = roundDownToSlot(interval.end);
  return end > start ? { start, end } : null;
}
