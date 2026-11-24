import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateRange,
  formatDuration,
  formatMinute,
  fromJsDate,
  isValidDate,
  minuteOf,
  parseTime,
  roundUpToSlot,
  startOfWeek,
  weekDays,
  weekdayOf,
} from '@/domain';

describe('datas', () => {
  it('calcula o dia da semana com domingo = 0', () => {
    expect(weekdayOf('2026-11-22')).toBe(0); // domingo
    expect(weekdayOf('2026-11-20')).toBe(5); // sexta
    expect(weekdayOf('1970-01-01')).toBe(4); // quinta
  });

  it('a semana começa no domingo (P10)', () => {
    expect(startOfWeek('2026-11-20')).toBe('2026-11-15');
    expect(startOfWeek('2026-11-15')).toBe('2026-11-15');
    expect(weekDays('2026-11-15')).toHaveLength(7);
    expect(weekDays('2026-11-15').at(-1)).toBe('2026-11-21');
  });

  it('soma dias atravessando mês e ano', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('gera intervalos de datas inclusivos', () => {
    expect(dateRange('2026-11-20', '2026-11-22')).toEqual(['2026-11-20', '2026-11-21', '2026-11-22']);
    expect(dateRange('2026-11-22', '2026-11-20')).toEqual([]);
  });

  it('valida datas', () => {
    expect(isValidDate('2026-02-28')).toBe(true);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('20/11/2026')).toBe(false);
  });
});

describe('horários', () => {
  it('formata e lê horários', () => {
    expect(formatMinute(870)).toBe('14:30');
    expect(formatMinute(1440)).toBe('24:00');
    expect(parseTime('07:30')).toBe(450);
    expect(parseTime('24:00')).toBe(1440);
    expect(parseTime('25:00')).toBeNaN();
    expect(parseTime('abc')).toBeNaN();
  });

  it('formata durações', () => {
    expect(formatDuration(0)).toBe('0h');
    expect(formatDuration(30)).toBe('30min');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(150)).toBe('2h30');
  });

  it('arredonda para a grade de 30 min', () => {
    expect(roundUpToSlot(0)).toBe(0);
    expect(roundUpToSlot(1)).toBe(30);
    expect(roundUpToSlot(30)).toBe(30);
    expect(roundUpToSlot(31)).toBe(60);
  });

  it('converte Date local para texto', () => {
    const text = fromJsDate(new Date(2026, 10, 20, 9, 5));
    expect(text).toBe('2026-11-20T09:05');
    expect(minuteOf(text)).toBe(545);
  });
});
