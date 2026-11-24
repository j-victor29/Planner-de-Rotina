import styles from './planning.module.css';
import type { IsoDate, PlanBlock } from '@/domain';
import { cx } from '@/utils/cx';
import { dayOfMonth, WEEKDAY_LONG, WEEKDAY_SHORT } from '@/utils/format';

interface DayTabsProps {
  days: IsoDate[];
  selected: IsoDate;
  today: IsoDate;
  blocks: PlanBlock[];
  onSelect: (day: IsoDate) => void;
}

/** Seleção do dia no celular (domingo a sábado). */
export function DayTabs({ days, selected, today, blocks, onSelect }: DayTabsProps) {
  return (
    <div className={styles.dayTabs} role="tablist" aria-label="Dias da semana">
      {days.map((day, index) => {
        const busy = blocks.some((b) => b.date === day);
        return (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={day === selected}
            aria-label={`${WEEKDAY_LONG[index]}, dia ${dayOfMonth(day)}${day === today ? ' (hoje)' : ''}`}
            className={cx(styles.dayTab, day === today && styles.dayTabToday)}
            onClick={() => onSelect(day)}
          >
            <span className={styles.dayTabName}>{WEEKDAY_SHORT[index]}</span>
            <span className={styles.dayTabNumber}>{dayOfMonth(day)}</span>
            <span className={cx(styles.dayTabDot, busy && styles.dayTabDotOn)} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
