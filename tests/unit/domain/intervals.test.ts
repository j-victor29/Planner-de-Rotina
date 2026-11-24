import { describe, expect, it } from 'vitest';
import { overlaps, snapToSlots, subtractIntervals, totalLength } from '@/domain';

describe('intervalos', () => {
  it('detecta sobreposição sem contar encostar', () => {
    expect(overlaps({ start: 0, end: 60 }, { start: 30, end: 90 })).toBe(true);
    expect(overlaps({ start: 0, end: 60 }, { start: 60, end: 90 })).toBe(false);
  });

  it('subtrai trechos ocupados', () => {
    const free = subtractIntervals(
      [{ start: 480, end: 1320 }],
      [
        { start: 540, end: 720 },
        { start: 1140, end: 1350 },
      ],
    );
    expect(free).toEqual([
      { start: 480, end: 540 },
      { start: 720, end: 1140 },
    ]);
    expect(totalLength(free)).toBe(480);
  });

  it('remove tudo quando o ocupado cobre o livre', () => {
    expect(subtractIntervals([{ start: 60, end: 120 }], [{ start: 0, end: 200 }])).toEqual([]);
  });

  it('encaixa na grade de 30 min', () => {
    expect(snapToSlots({ start: 485, end: 600 })).toEqual({ start: 510, end: 600 });
    expect(snapToSlots({ start: 485, end: 505 })).toBeNull();
  });
});
