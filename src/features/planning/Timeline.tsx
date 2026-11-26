import { useEffect, useRef, type CSSProperties } from 'react';
import styles from './planning.module.css';
import { TimelineBlock } from './TimelineBlock';
import { HOUR_HEIGHT, PX_PER_MINUTE, visibleRange } from './timelineScale';
import {
  commitmentsOn,
  formatDuration,
  formatMinute,
  dailyLimitFor,
  freeIntervals,
  isRestDay,
  usedMinutes,
  weekdayOf,
  type FixedCommitment,
  type Id,
  type IsoDate,
  type PlanBlock,
  type Task,
  type UserSettings,
} from '@/domain';
import { cx } from '@/utils/cx';
import { dayOfMonth, formatTimeRange, WEEKDAY_LONG, WEEKDAY_SHORT } from '@/utils/format';

interface TimelineProps {
  days: IsoDate[];
  today: IsoDate;
  nowMinute: number;
  commitments: FixedCommitment[];
  blocks: PlanBlock[];
  tasksById: Map<Id, Task>;
  settings: UserSettings;
  onSelectBlock: (block: PlanBlock) => void;
}

/**
 * RF05 — linha do tempo de domingo a sábado (desktop) ou de um dia (celular).
 * Camadas: horários livres, compromissos fixos, blocos de tarefa e a linha do "agora".
 */
export function Timeline({
  days,
  today,
  nowMinute,
  commitments,
  blocks,
  tasksById,
  settings,
  onSelectBlock,
}: TimelineProps) {
  const range = visibleRange(settings);
  const hours = Array.from({ length: (range.end - range.start) / 60 }, (_, i) => range.start + i * 60);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clamp = (m: number) => Math.min(range.end, Math.max(range.start, m));
  const top = (m: number) => (clamp(m) - range.start) * PX_PER_MINUTE;

  // Rola até perto do horário atual ao abrir.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = Math.max(0, top(nowMinute - 90));
    // Só na primeira renderização.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={styles.timeline}
      style={{ '--days': days.length } as CSSProperties}
      role="region"
      aria-label="Linha do tempo"
    >
      <div className={styles.timelineScroll} ref={scrollRef}>
        <div className={styles.timelineHead}>
          <div className={styles.gutterHead} />
          {days.map((day) => {
            const used = usedMinutes(day, blocks);
            const limit = dailyLimitFor(day, settings);
            const pct = Math.min(100, (used / limit) * 100);
            const wd = weekdayOf(day);
            const rest = isRestDay(day, settings);
            return (
              <div key={day} className={cx(styles.dayHead, day === today && styles.dayHeadToday)}>
                <span className={styles.dayName}>
                  <span className={styles.dayWeekday}>{WEEKDAY_SHORT[wd]}</span>
                  <span className={styles.dayNumber}>{dayOfMonth(day)}</span>
                </span>
                {rest ? (
                  <span className={styles.restChip}>Descanso</span>
                ) : (
                  <span className={styles.capacity} title={`${formatDuration(used)} de ${formatDuration(limit)} planejadas`}>
                    <span className={styles.capacityTrack}>
                      <span className={styles.capacityFill} style={{ width: `${pct}%` }} />
                    </span>
                    <span className={styles.capacityText}>
                      {formatDuration(used)}/{formatDuration(limit)}
                    </span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.timelineBody} style={{ height: (range.end - range.start) * PX_PER_MINUTE }}>
          <div className={styles.gutter} aria-hidden="true">
            {hours.map((h) => (
              <span key={h} className={styles.hourLabel} style={{ top: (h - range.start) * PX_PER_MINUTE }}>
                {formatMinute(h)}
              </span>
            ))}
          </div>

          {days.map((day) => {
            const isPast = day < today;
            const isToday = day === today;
            const dayBlocks = blocks.filter((b) => b.date === day);
            const free = isPast
              ? []
              : freeIntervals(day, settings, commitments, blocks, isToday ? nowMinute : 0);
            return (
              <div
                key={day}
                className={cx(styles.column, isRestDay(day, settings) && styles.restColumn)}
                style={{ backgroundSize: `100% ${HOUR_HEIGHT}px` }}
                aria-label={WEEKDAY_LONG[weekdayOf(day)]}
              >
                {(isPast || isToday) && (
                  <div
                    className={styles.past}
                    style={{ height: isPast ? '100%' : top(nowMinute) }}
                    aria-hidden="true"
                  />
                )}
                {isRestDay(day, settings) && (
                  <span className={styles.restLabel} aria-hidden="true">
                    Dia de descanso
                  </span>
                )}
                {free.map((i) => (
                  <div
                    key={i.start}
                    className={styles.free}
                    style={{ top: top(i.start), height: (clamp(i.end) - clamp(i.start)) * PX_PER_MINUTE }}
                    title={`Livre: ${formatTimeRange(i.start, i.end)}`}
                    aria-hidden="true"
                  />
                ))}
                {commitmentsOn(day, commitments)
                  .filter((c) => c.end > range.start && c.start < range.end)
                  .map((c) => (
                    <div
                      key={c.id}
                      className={styles.commitment}
                      style={{ top: top(c.start), height: (clamp(c.end) - clamp(c.start)) * PX_PER_MINUTE - 3 }}
                    >
                      <span className={styles.commitmentTitle}>{c.title}</span>
                      <span className={styles.commitmentTime}>{formatTimeRange(c.start, c.end)}</span>
                    </div>
                  ))}
                {dayBlocks.map((b) => {
                  const task = tasksById.get(b.taskId);
                  return task ? (
                    <TimelineBlock
                      key={b.id}
                      block={b}
                      task={task}
                      rangeStart={range.start}
                      onSelect={onSelectBlock}
                    />
                  ) : null;
                })}
                {isToday && nowMinute >= range.start && nowMinute <= range.end && (
                  <div className={styles.now} style={{ top: top(nowMinute) }} aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
