import { awakeIntervals, type UserSettings } from '@/domain';

/** Altura de uma hora na linha do tempo, em pixels. */
export const HOUR_HEIGHT = 56;
export const PX_PER_MINUTE = HOUR_HEIGHT / 60;

/** Faixa de horas exibida: o maior trecho acordado do dia, em horas cheias. */
export function visibleRange(settings: UserSettings): { start: number; end: number } {
  const awake = awakeIntervals(settings);
  const main = awake.reduce(
    (best, i) => (i.end - i.start > best.end - best.start ? i : best),
    awake[0] ?? { start: 0, end: 24 * 60 },
  );
  return { start: Math.floor(main.start / 60) * 60, end: Math.ceil(main.end / 60) * 60 };
}
