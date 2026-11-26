import { describe, expect, it } from 'vitest';
import { CLOCK_MESSAGES, DURATION_MESSAGES, maskClock, parseClock, parseDuration } from '@/domain';

describe('parseClock', () => {
  it.each([
    ['19:30', 1170],
    ['1930', 1170],
    ['19h30', 1170],
    ['19h', 1140],
    ['7', 420],
    ['730', 450],
    ['00:00', 0],
    ['24:00', 1440],
  ])('"%s" → %i', (text, minutes) => {
    expect(parseClock(text)).toEqual({ ok: true, minutes });
  });

  it.each([
    ['', CLOCK_MESSAGES.empty],
    ['19:15', CLOCK_MESSAGES.slot],
    ['19:45', CLOCK_MESSAGES.slot],
    ['25:00', CLOCK_MESSAGES.invalid],
    ['24:30', CLOCK_MESSAGES.invalid],
    ['19:60', CLOCK_MESSAGES.invalid],
    ['abc', CLOCK_MESSAGES.invalid],
  ])('"%s" é rejeitado', (text, error) => {
    expect(parseClock(text)).toEqual({ ok: false, error });
  });
});

describe('parseDuration', () => {
  it.each([
    ['10', 600],
    ['10h', 600],
    ['10:30', 630],
    ['10h30', 630],
    ['10,5', 630],
    ['0:30', 30],
    ['30min', 30],
    [' 2 h 30 ', 150],
  ])('"%s" → %i', (text, minutes) => {
    expect(parseDuration(text)).toEqual({ ok: true, minutes });
  });

  it.each([
    ['', DURATION_MESSAGES.empty],
    ['0', DURATION_MESSAGES.zero],
    ['1:15', DURATION_MESSAGES.slot],
    ['20min', DURATION_MESSAGES.slot],
    ['1:75', DURATION_MESSAGES.invalid],
    ['duas horas', DURATION_MESSAGES.invalid],
  ])('"%s" é rejeitado', (text, error) => {
    expect(parseDuration(text)).toEqual({ ok: false, error });
  });
});

describe('maskClock', () => {
  it('coloca os dois-pontos enquanto o usuário digita', () => {
    expect(maskClock('7')).toBe('7');
    expect(maskClock('73')).toBe('73');
    expect(maskClock('730')).toBe('7:30');
    expect(maskClock('1930')).toBe('19:30');
    expect(maskClock('19h30x')).toBe('19:30');
    expect(maskClock('193045')).toBe('19:30');
  });
});
