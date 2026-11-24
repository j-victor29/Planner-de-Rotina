import { RULES } from './rules';
import type { IsoDate, IsoDateTime, MinuteOfDay, Weekday } from './types';

/**
 * Funções de data e hora sem dependência de fuso: tudo é calculado sobre
 * números de dia (dias desde 1970-01-01), o que mantém o algoritmo determinístico.
 */

const DAY_MS = 86_400_000;
export const MINUTES_PER_DAY = 1440;

const pad = (n: number) => String(n).padStart(2, '0');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Dias desde 1970-01-01. */
export function dayNumber(date: IsoDate): number {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function fromDayNumber(n: number): IsoDate {
  const d = new Date(n * DAY_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function isValidDate(value: string): boolean {
  return DATE_PATTERN.test(value) && fromDayNumber(dayNumber(value)) === value;
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromDayNumber(dayNumber(date) + days);
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return dayNumber(to) - dayNumber(from);
}

/** Lista de datas de `from` até `to`, inclusive. */
export function dateRange(from: IsoDate, to: IsoDate): IsoDate[] {
  const total = daysBetween(from, to);
  return Array.from({ length: Math.max(0, total + 1) }, (_, i) => addDays(from, i));
}

/** 0 = domingo … 6 = sábado. 1970-01-01 foi uma quinta-feira (4). */
export function weekdayOf(date: IsoDate): Weekday {
  return ((((dayNumber(date) + 4) % 7) + 7) % 7) as Weekday;
}

/** Domingo da semana que contém `date`. */
export function startOfWeek(date: IsoDate): IsoDate {
  return addDays(date, -weekdayOf(date));
}

export function weekDays(weekStart: IsoDate): IsoDate[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function dateOf(dateTime: IsoDateTime): IsoDate {
  return dateTime.slice(0, 10);
}

export function minuteOf(dateTime: IsoDateTime): MinuteOfDay {
  return Number(dateTime.slice(11, 13)) * 60 + Number(dateTime.slice(14, 16));
}

export function toDateTime(date: IsoDate, minute: MinuteOfDay): IsoDateTime {
  return `${date}T${formatMinute(minute)}`;
}

/** Converte um Date do navegador para o horário local "YYYY-MM-DDTHH:mm". */
export function fromJsDate(d: Date): IsoDateTime {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 870 → "14:30"; 1440 → "24:00". */
export function formatMinute(minute: MinuteOfDay): string {
  return `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`;
}

/** "14:30" → 870. Retorna NaN se o formato for inválido. */
export function parseTime(value: string): MinuteOfDay {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return Number.NaN;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 24 || m > 59 || (h === 24 && m > 0)) return Number.NaN;
  return h * 60 + m;
}

/** 150 → "2h30"; 120 → "2h"; 30 → "30min". */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0h';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h${pad(m)}`;
}

export function roundUpToSlot(minutes: number, slot: number = RULES.SLOT_MINUTES): number {
  return Math.ceil(minutes / slot) * slot;
}

export function roundDownToSlot(minutes: number, slot: number = RULES.SLOT_MINUTES): number {
  return Math.floor(minutes / slot) * slot;
}

export function isOnSlot(minutes: number, slot: number = RULES.SLOT_MINUTES): boolean {
  return Number.isInteger(minutes) && minutes % slot === 0;
}
