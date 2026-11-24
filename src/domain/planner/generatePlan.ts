import { RULES } from '../rules';
import { blockMinutes, freeIntervals, usedMinutes } from '../schedule';
import { dateOf, dateRange, minuteOf, roundDownToSlot, roundUpToSlot } from '../time';
import type { Id, IsoDate, PlanAlert, PlanBlock, PlanInput, PlanResult, Priority, Task } from '../types';

const PRIORITY_ORDER: Record<Priority, number> = { alta: 0, media: 1, baixa: 2 };

/** Comparação de texto independente de idioma (determinística). */
function compareText(a: string, b: string): number {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

/**
 * RN06 — ordem de alocação: prazo mais próximo → maior prioridade →
 * menor duração restante → criação mais antiga → id (desempate total).
 */
export function compareTasks(a: Task, b: Task, remaining: ReadonlyMap<Id, number>): number {
  return (
    compareText(a.deadline, b.deadline) ||
    PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
    (remaining.get(a.id) ?? 0) - (remaining.get(b.id) ?? 0) ||
    compareText(a.createdAt, b.createdAt) ||
    compareText(a.id, b.id)
  );
}

/**
 * RF04, RF09, RF10 — algoritmo de planejamento.
 *
 * Função pura e determinística (RNF06): não lê relógio nem usa aleatoriedade;
 * o instante atual chega em `input.now`.
 *
 * 1. Mantém blocos fixados e concluídos (RN05) e descarta o resto.
 * 2. Ordena as tarefas pela RN06.
 * 3. Para cada tarefa, espalha blocos de 1 h a 2 h pelos dias livres até o prazo
 *    (blocos de 30 min só para o restante, RN07), sem passar do limite diário (RN04)
 *    e sem sobrepor compromissos ou outros blocos (RN03).
 * 4. O que não couber vira alerta (RF10).
 */
export function generatePlan(input: PlanInput): PlanResult {
  const { tasks, commitments, settings } = input;
  const today = dateOf(input.now);
  const firstSlotToday = roundUpToSlot(minuteOf(input.now));

  const taskIds = new Set(tasks.map((t) => t.id));
  const blocks: PlanBlock[] = input.existingBlocks
    .filter((b) => (b.pinned || b.done) && taskIds.has(b.taskId))
    .map((b) => ({ ...b }));
  const alerts: PlanAlert[] = [];
  const usedIds = new Set(blocks.map((b) => b.id));
  /** Id estável a partir da posição; recebe sufixo se já existir (ex.: bloco movido). */
  const blockId = (taskId: Id, date: IsoDate, start: number) => {
    const base = `${taskId}@${date}+${start}`;
    let id = base;
    for (let n = 2; usedIds.has(id); n++) id = `${base}#${n}`;
    usedIds.add(id);
    return id;
  };

  const remaining = new Map<Id, number>();
  for (const task of tasks) {
    const alreadyPlaced = blocks
      .filter((b) => b.taskId === task.id)
      .reduce((sum, b) => sum + blockMinutes(b), 0);
    remaining.set(task.id, Math.max(0, roundUpToSlot(task.durationMinutes) - alreadyPlaced));
  }

  const ordered = [...tasks].sort((a, b) => compareTasks(a, b, remaining));

  const fromMinute = (date: IsoDate) => (date === today ? firstSlotToday : 0);
  const free = (date: IsoDate) =>
    freeIntervals(date, settings, commitments, blocks, fromMinute(date));
  const limitLeft = (date: IsoDate) => settings.dailyLimitMinutes - usedMinutes(date, blocks);
  const hasRoom = (date: IsoDate) => limitLeft(date) >= RULES.SLOT_MINUTES && free(date).length > 0;

  for (const task of ordered) {
    let rest = remaining.get(task.id) ?? 0;
    if (rest === 0) continue;

    const days = task.deadline < today ? [] : dateRange(today, task.deadline).filter(hasRoom);

    /** Tenta colocar um bloco de até `want` minutos em `date`. Retorna os minutos alocados. */
    const place = (date: IsoDate, want: number): number => {
      const size = Math.min(want, rest, limitLeft(date), RULES.BLOCK_MAX_MINUTES);
      for (const interval of free(date)) {
        const length = roundDownToSlot(Math.min(size, interval.end - interval.start));
        if (length < RULES.BLOCK_MIN_MINUTES) continue;
        // RN07: bloco menor que 1 h só quando for o restante da tarefa.
        if (length < RULES.BLOCK_PREFERRED_MIN_MINUTES && length < rest) continue;
        blocks.push({
          id: blockId(task.id, date, interval.start),
          taskId: task.id,
          date,
          start: interval.start,
          end: interval.start + length,
          pinned: false,
          done: false,
        });
        rest -= length;
        return length;
      }
      return 0;
    };

    if (days.length > 0) {
      // Passo 1: espalhar blocos do tamanho-alvo uniformemente entre os dias.
      const target = Math.min(
        RULES.BLOCK_MAX_MINUTES,
        Math.max(RULES.BLOCK_PREFERRED_MIN_MINUTES, roundUpToSlot(rest / days.length)),
      );
      const count = Math.min(days.length, Math.ceil(rest / target));
      for (let i = 0; i < count && rest > 0; i++) {
        const day = days[Math.floor((i * days.length) / count)];
        if (day) place(day, target);
      }

      // Passo 2: completar o que faltou, do dia mais cedo ao mais tarde.
      let progress = true;
      while (rest > 0 && progress) {
        progress = false;
        for (const day of days) {
          if (rest === 0) break;
          if (place(day, RULES.BLOCK_MAX_MINUTES) > 0) progress = true;
        }
      }
    }

    if (rest > 0) alerts.push({ taskId: task.id, missingMinutes: rest });
  }

  blocks.sort(
    (a, b) => compareText(a.date, b.date) || a.start - b.start || compareText(a.id, b.id),
  );
  return { blocks, alerts };
}
