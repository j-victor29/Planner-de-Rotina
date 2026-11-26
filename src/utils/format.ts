import {
  addDays,
  daysBetween,
  formatMinute,
  weekdayOf,
  type IsoDate,
  type MinuteOfDay,
  type PreferredPeriod,
  type Priority,
} from '@/domain';

/** Textos de exibição (pt-BR). Regras de negócio ficam em src/domain. */

export const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;
export const WEEKDAY_LETTER = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;
export const WEEKDAY_LONG = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const PRIORITY_LABEL: Record<Priority, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const PERIOD_LABEL: Record<PreferredPeriod, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
  qualquer: 'Tanto faz',
};

/** Horário para preencher um campo de texto (1440 vira "00:00"). */
export function clockText(minute: MinuteOfDay): string {
  return formatMinute(minute % (24 * 60));
}

const parts = (date: IsoDate) => ({
  year: Number(date.slice(0, 4)),
  month: Number(date.slice(5, 7)),
  day: Number(date.slice(8, 10)),
});

export function dayOfMonth(date: IsoDate): number {
  return parts(date).day;
}

/** "20 de nov." */
export function formatDayMonth(date: IsoDate): string {
  const { day, month } = parts(date);
  return `${day} de ${MONTHS[month - 1]}.`;
}

/** "sex, 20 de nov." */
export function formatShortDate(date: IsoDate): string {
  return `${WEEKDAY_SHORT[weekdayOf(date)]?.toLowerCase()}, ${formatDayMonth(date)}`;
}

/** "15 – 21 de nov. de 2026" ou "29 de nov. – 5 de dez. de 2026". */
export function formatWeekRange(weekStart: IsoDate): string {
  const end = addDays(weekStart, 6);
  const a = parts(weekStart);
  const b = parts(end);
  if (a.month === b.month) return `${a.day} – ${b.day} de ${MONTHS[b.month - 1]}. de ${b.year}`;
  return `${formatDayMonth(weekStart)} – ${formatDayMonth(end)} de ${b.year}`;
}

/** Prazo relativo: "vence hoje", "vence amanhã", "em 5 dias", "venceu há 2 dias". */
export function formatDeadline(deadline: IsoDate, today: IsoDate): string {
  const diff = daysBetween(today, deadline);
  if (diff === 0) return 'vence hoje';
  if (diff === 1) return 'vence amanhã';
  if (diff > 1) return `vence em ${diff} dias`;
  return diff === -1 ? 'venceu ontem' : `venceu há ${-diff} dias`;
}

export function formatTimeRange(start: MinuteOfDay, end: MinuteOfDay): string {
  return `${formatMinute(start)} – ${formatMinute(end)}`;
}

export interface Option {
  value: string;
  label: string;
}

/** Opções de horário a cada 30 min, de `from` até `to`, inclusive. */
export function timeOptions(from = 0, to = 24 * 60): Option[] {
  const options: Option[] = [];
  for (let m = from; m <= to; m += 30) options.push({ value: String(m), label: formatMinute(m) });
  return options;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}
