import type { UserSettings } from '@/domain';

/** Altura de uma hora na linha do tempo, em pixels. */
export const HOUR_HEIGHT = 56;
export const PX_PER_MINUTE = HOUR_HEIGHT / 60;

/** Faixa de horas exibida: janela do usuário arredondada para horas cheias. */
export function visibleRange(settings: UserSettings): { start: number; end: number } {
  return {
    start: Math.floor(settings.windowStart / 60) * 60,
    end: Math.ceil(settings.windowEnd / 60) * 60,
  };
}
