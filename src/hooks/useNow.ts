import { useEffect, useState } from 'react';
import { fromJsDate, type IsoDateTime } from '@/domain';

/** Data e hora local atual, atualizada a cada minuto. */
export function useNow(intervalMs = 60_000): IsoDateTime {
  const [now, setNow] = useState(() => fromJsDate(new Date()));
  useEffect(() => {
    const timer = window.setInterval(() => setNow(fromJsDate(new Date())), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}
