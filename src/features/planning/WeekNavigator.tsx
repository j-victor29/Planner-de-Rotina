import styles from './planning.module.css';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import type { IsoDate } from '@/domain';
import { formatWeekRange } from '@/utils/format';

interface WeekNavigatorProps {
  weekStart: IsoDate;
  isCurrentWeek: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function WeekNavigator({ weekStart, isCurrentWeek, onPrevious, onNext, onToday }: WeekNavigatorProps) {
  return (
    <div className={styles.navigator}>
      <IconButton icon="chevron-left" label="Semana anterior" onClick={onPrevious} />
      <h2 className={styles.weekLabel} aria-live="polite">
        {formatWeekRange(weekStart)}
      </h2>
      <IconButton icon="chevron-right" label="Próxima semana" onClick={onNext} />
      <Button variant="secondary" size="sm" onClick={onToday} disabled={isCurrentWeek}>
        Hoje
      </Button>
    </div>
  );
}
